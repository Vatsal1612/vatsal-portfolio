import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.CORS_ORIGINS || '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

let cachedClient = null;
async function getDb() {
  if (!process.env.MONGO_URL) return null;
  if (!cachedClient) {
    cachedClient = new MongoClient(process.env.MONGO_URL);
    await cachedClient.connect();
  }
  const dbName = process.env.DB_NAME || 'portfolio';
  return cachedClient.db(dbName);
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

async function route(request, ctx) {
  const params = await ctx.params;
  const segments = params?.path || [];
  const path = '/' + segments.join('/');
  const method = request.method;

  try {
    // Health
    if (path === '/' || path === '/health') {
      return NextResponse.json({ status: 'ok', service: 'portfolio-api', ts: new Date().toISOString() }, { headers: corsHeaders });
    }

    // Contact form submission -> stored in Mongo
    if (path === '/contact' && method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const { name, email, subject, message } = body;
      if (!name || !email || !message) {
        return NextResponse.json({ error: 'Missing required fields: name, email, message' }, { status: 400, headers: corsHeaders });
      }
      const doc = {
        id: uuidv4(),
        name: String(name).slice(0, 200),
        email: String(email).slice(0, 200),
        subject: String(subject || 'Portfolio contact').slice(0, 300),
        message: String(message).slice(0, 5000),
        userAgent: request.headers.get('user-agent') || '',
        createdAt: new Date().toISOString(),
      };
      const db = await getDb();
      if (db) {
        await db.collection('contact_messages').insertOne(doc);
      }
      if (!process.env.RESEND_API_KEY || !process.env.CONTACT_TO_EMAIL || !process.env.CONTACT_FROM_EMAIL) {
        return NextResponse.json({ error: 'Email service is not configured' }, { status: 503, headers: corsHeaders });
      }
      const mailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL,
          to: [process.env.CONTACT_TO_EMAIL],
          reply_to: doc.email,
          subject: doc.subject,
          text: `Name: ${doc.name}\nEmail: ${doc.email}\n\n${doc.message}`,
        }),
      });
      if (!mailRes.ok) {
        const mailError = await mailRes.text();
        console.error('Email provider error', mailError);
        return NextResponse.json({ error: 'Could not send email' }, { status: 502, headers: corsHeaders });
      }
      return NextResponse.json({ ok: true, id: doc.id }, { headers: corsHeaders });
    }

    // GitHub public stats proxy (no auth needed for public data)
    if (path === '/github' && method === 'GET') {
      const url = new URL(request.url);
      const user = url.searchParams.get('user') || 'Vatsal1612';
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${user}`, { next: { revalidate: 3600 } }),
        fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=updated`, { next: { revalidate: 3600 } }),
      ]);
      if (!userRes.ok) return NextResponse.json({ error: 'GitHub user not found' }, { status: 404, headers: corsHeaders });
      const u = await userRes.json();
      const repos = reposRes.ok ? await reposRes.json() : [];
      const stars = repos.reduce((a, r) => a + (r.stargazers_count || 0), 0);
      const forks = repos.reduce((a, r) => a + (r.forks_count || 0), 0);
      const langs = {};
      repos.forEach((r) => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
      return NextResponse.json({
        login: u.login, name: u.name, avatar_url: u.avatar_url, html_url: u.html_url,
        public_repos: u.public_repos, followers: u.followers, following: u.following,
        bio: u.bio, stars, forks, languages: langs,
        topRepos: repos.filter(r => !r.fork).slice(0, 6).map(r => ({
          name: r.name, description: r.description, html_url: r.html_url,
          stargazers_count: r.stargazers_count, language: r.language, updated_at: r.updated_at,
        })),
      }, { headers: corsHeaders });
    }

    return NextResponse.json({ error: `Route not found: ${path}` }, { status: 404, headers: corsHeaders });
  } catch (err) {
    console.error('API error', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}

export const GET = route;
export const POST = route;
export const PUT = route;
export const DELETE = route;
export const PATCH = route;
