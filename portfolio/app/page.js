'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValue, useTransform } from 'framer-motion';
import {
  Github, Linkedin, Mail, Phone, Download, ExternalLink, MapPin,
  Code2, Database, Server, Wrench, Layers, Rocket, Award, GraduationCap,
  Briefcase, ChevronUp, Command, Search, Terminal, Sparkles, Zap,
  ArrowRight, Trophy, BookOpen, Sun, Moon, Menu, X, CheckCircle2, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

/* ------------------- DATA ------------------- */
const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
];

const ROLES = ['.NET Developer', 'Backend Engineer', 'Full Stack Developer', 'Microservices Architect'];

const SKILLS = {
  Backend: {
    icon: Server,
    color: 'from-blue-500 to-cyan-500',
    items: ['C#', '.NET', 'ASP.NET Core', 'ASP.NET Core MVC', 'REST APIs'],
  },
  Frontend: {
    icon: Code2,
    color: 'from-indigo-500 to-blue-500',
    items: ['HTML', 'CSS', 'Bootstrap', 'JavaScript', 'AJAX', 'Kendo UI'],
  },
  Databases: {
    icon: Database,
    color: 'from-cyan-500 to-teal-500',
    items: ['PostgreSQL', 'MySQL'],
  },
  Architecture: {
    icon: Layers,
    color: 'from-violet-500 to-indigo-500',
    items: ['RabbitMQ', 'Redis', 'Elasticsearch', 'Microservices'],
  },
  'Dev Tools': {
    icon: Wrench,
    color: 'from-sky-500 to-blue-600',
    items: ['Git', 'GitHub', 'Visual Studio', 'VS Code'],
  },
};

const EXPERIENCE = [
  {
    company: 'Casepoint Pvt. Ltd.',
    role: 'Full Stack Software Development Intern',
    period: 'January 2026 – May 2026',
    location: 'Surat, India',
    achievements: [
      'Built scalable ASP.NET Core MVC application with 5+ business modules',
      'Improved page load performance by 25% via query & caching optimizations',
      'Optimized complex PostgreSQL queries with indexing and query planning',
      'Participated in the complete SDLC – design, development, testing & release',
    ],
    tech: ['ASP.NET Core MVC', 'C#', 'PostgreSQL', 'Redis', 'JavaScript'],
    metrics: [
      { label: 'Modules built', value: '5+' },
      { label: 'Perf gain', value: '25%' },
      { label: 'Uptime', value: '99.9%' },
    ],
  },
];

const PROJECTS = [
  {
    title: 'FarmBridge',
    tag: 'Distributed Procurement Platform',
    description:
      'Event-driven procurement platform connecting farmers, vendors and buyers with real-time search and messaging.',
    features: [
      'RabbitMQ event-driven microservices',
      'Elasticsearch full-text search',
      'PostgreSQL with optimized indexing',
      'Role-based dashboards',
    ],
    tech: ['ASP.NET Core', 'C#', 'RabbitMQ', 'Elasticsearch', 'PostgreSQL'],
    accent: 'from-emerald-500 via-teal-500 to-cyan-500',
    icon: '🌾',
    github: 'https://github.com/Vatsal1612',
    demo: '#',
  },
  {
    title: 'Clinic Management System',
    tag: 'Healthcare SaaS',
    description:
      'End-to-end clinic operations with appointment scheduling, patient records, and cached read paths.',
    features: [
      'Appointment scheduling engine',
      'Redis caching for hot reads',
      'RabbitMQ inter-service messaging',
      'Fully responsive UI',
    ],
    tech: ['ASP.NET Core MVC', 'C#', 'Redis', 'RabbitMQ', 'PostgreSQL'],
    accent: 'from-blue-500 via-indigo-500 to-violet-500',
    icon: '🏥',
    github: 'https://github.com/Vatsal1612',
    demo: '#',
  },
  {
    title: 'Task Management System',
    tag: 'Productivity API + UI',
    description:
      'JWT-secured task platform with role-based access, CRUD APIs, and AJAX-powered UI.',
    features: [
      'JWT authentication & refresh tokens',
      'Role-based access control',
      'REST CRUD APIs',
      'AJAX-driven interactions',
    ],
    tech: ['ASP.NET Core', 'C#', 'JWT', 'AJAX', 'PostgreSQL'],
    accent: 'from-cyan-500 via-sky-500 to-blue-600',
    icon: '✅',
    github: 'https://github.com/Vatsal1612',
    demo: '#',
  },
  {
    title: 'Pharmacy Management System',
    tag: 'Inventory & Billing',
    description:
      'Full pharmacy operations software covering inventory, prescriptions, and billing workflows.',
    features: ['Inventory tracking', 'Billing & invoices', 'MySQL data layer', 'PHP backend'],
    tech: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap'],
    accent: 'from-fuchsia-500 via-purple-500 to-indigo-500',
    icon: '💊',
    github: 'https://github.com/Vatsal1612',
    demo: '#',
  },
];

const ACHIEVEMENTS = [
  { title: 'Smart India Hackathon', detail: 'College Level Rank 3', icon: Trophy },
  { title: 'Governor Award', detail: 'Recipient for academic & extracurricular excellence', icon: Award },
];

const CERTIFICATIONS = [
  { title: 'Coursera Networking', issuer: 'Coursera', icon: BookOpen },
  { title: 'BSE FINTECH', issuer: 'Bombay Stock Exchange', icon: Award },
];

const BLOG_POSTS = [
  {
    title: 'How I Built a Microservices App with RabbitMQ and ASP.NET Core',
    excerpt: 'A deep dive into designing event-driven microservices with RabbitMQ, saga patterns and ASP.NET Core.',
    date: 'Jun 2025', tag: 'Microservices', minutes: 9,
  },
  {
    title: 'Redis Caching in ASP.NET Core Explained',
    excerpt: 'Practical caching strategies: cache-aside, sliding expiration, distributed locks and pitfalls.',
    date: 'Jun 2025', tag: 'Performance', minutes: 7,
  },
  {
    title: 'JWT Authentication in .NET 10',
    excerpt: 'End-to-end JWT with refresh tokens, role claims and secure key rotation on ASP.NET Core.',
    date: 'Jun 2025', tag: 'Security', minutes: 8,
  },
  {
    title: 'Optimizing PostgreSQL Queries in ASP.NET Core',
    excerpt: 'From EXPLAIN ANALYZE to compound indexes — a checklist that squeezes out every millisecond.',
    date: 'Jun 2025', tag: 'Database', minutes: 10,
  },
];

/* ------------------- HELPERS ------------------- */
function useTyping(words, speed = 90, pause = 1400) {
  const [i, setI] = useState(0);
  const [text, setText] = useState('');
  const [del, setDel] = useState(false);
  useEffect(() => {
    const current = words[i % words.length];
    const t = setTimeout(() => {
      if (!del) {
        setText(current.slice(0, text.length + 1));
        if (text === current) setTimeout(() => setDel(true), pause);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text === '') { setDel(false); setI((v) => v + 1); }
      }
    }, del ? speed / 2 : speed);
    return () => clearTimeout(t);
  }, [text, del, i, words, speed, pause]);
  return text;
}

function AnimatedCounter({ to = 100, suffix = '', duration = 1.5 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const start = performance.now();
        const step = (t) => {
          const p = Math.min((t - start) / (duration * 1000), 1);
          setVal(Math.floor(p * to));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

function MagneticButton({ children, className = '', ...props }) {
  const ref = useRef(null);
  const [t, setT] = useState({ x: 0, y: 0 });
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    setT({ x: x * 0.2, y: y * 0.2 });
  };
  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
      animate={{ x: t.x, y: t.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className={className}
      {...props}
    >{children}</motion.button>
  );
}

/* ------------------- COMPONENTS ------------------- */
function Splash({ done }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1220]"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-5xl md:text-6xl font-black gradient-text tracking-tight"
            >VC</motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="mt-4 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 rounded-full"
            />
            <div className="mt-3 text-xs text-slate-400 mono tracking-widest">LOADING PORTFOLIO…</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Cursor() {
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dx = useSpring(x, { stiffness: 500, damping: 30, mass: 0.3 });
  const dy = useSpring(y, { stiffness: 500, damping: 30, mass: 0.3 });
  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) return;
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); setVisible(true); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);
  if (!visible) return null;
  return (
    <>
      <motion.div style={{ x: dx, y: dy }} className="pointer-events-none fixed left-0 top-0 z-[90] hidden md:block">
        <div className="-translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-cyan-400/70 mix-blend-difference" />
      </motion.div>
      <motion.div style={{ x, y }} className="pointer-events-none fixed left-0 top-0 z-[90] hidden md:block">
        <div className="-translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan-300" />
      </motion.div>
    </>
  );
}

function Navbar({ active, onOpenCmd }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="mx-auto max-w-6xl px-4">
        <div className={`glass rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between ${scrolled ? 'shadow-xl shadow-black/30' : ''}`}>
          <a href="#home" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 grid place-items-center font-black text-white shadow-lg shadow-blue-500/30">V</div>
            <span className="font-semibold tracking-tight">Vatsal<span className="text-cyan-400">.</span></span>
          </a>
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${active === n.id ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >{n.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={onOpenCmd} className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-xs text-slate-400 hover:text-white transition-colors">
              <Search className="w-3.5 h-3.5" /> Search <kbd className="ml-1 px-1.5 py-0.5 rounded bg-white/10 mono">⌘K</kbd>
            </button>
            <a href="/Vatsal_Chhatbar_Resume.pdf" download
              className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium hover:opacity-90 transition">
              <Download className="w-4 h-4" /> Resume
            </a>
            <button className="lg:hidden p-2 rounded-lg hover:bg-white/5" onClick={() => setOpen(!open)}>
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="lg:hidden mt-2 glass rounded-2xl p-3 grid grid-cols-2 gap-1">
              {NAV.map((n) => (
                <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5">{n.label}</a>
              ))}
              <a href="/Vatsal_Chhatbar_Resume.pdf" download className="col-span-2 mt-1 px-3 py-2 rounded-lg text-sm bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-center">Download Resume</a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

function CodeBackground() {
  const lines = useMemo(() => [
    'public class Portfolio : IWebApp {',
    '  private readonly ILogger _log;',
    '  public async Task<IActionResult> Build()',
    '  {',
    '    var services = new ServiceCollection()',
    '      .AddSingleton<IMessageBus, RabbitMQ>()',
    '      .AddSingleton<ICache, RedisCache>()',
    '      .AddSingleton<ISearch, Elasticsearch>();',
    '    var app = builder.Build();',
    '    app.MapControllers();',
    '    await app.RunAsync();',
    '    return Ok(new { author = "Vatsal Chhatbar" });',
    '  }',
    '}',
  ], []);
  return (
    <pre className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.09] mono text-[11px] leading-5 p-8 text-slate-300 select-none">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i}>{lines.join('\n')}{'\n\n'}</div>
      ))}
    </pre>
  );
}

function Hero() {
  const typed = useTyping(ROLES);
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <CodeBackground />
      {/* Blobs */}
      <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-blue-600/30 blur-[120px] animate-blob" />
      <div className="absolute top-1/3 -right-32 w-[520px] h-[520px] rounded-full bg-indigo-600/25 blur-[120px] animate-blob" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-0 left-1/3 w-[420px] h-[420px] rounded-full bg-cyan-500/20 blur-[110px] animate-blob" style={{ animationDelay: '4s' }} />

      <div className="relative mx-auto max-w-6xl px-4 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs text-slate-300 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Available for full-time opportunities
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.05 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95]">
            Vatsal <br />
            <span className="gradient-text">Chhatbar</span>
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-5 text-xl md:text-2xl text-slate-300">
            <span className="cursor-blink mono">{typed || ' '}</span>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-6 max-w-2xl text-slate-400 text-base md:text-lg leading-relaxed">
            Results-driven .NET Full Stack Developer crafting scalable web apps with{' '}
            <span className="text-white font-medium">ASP.NET Core MVC</span>, <span className="text-white font-medium">C#</span>, PostgreSQL, RabbitMQ, Redis & Elasticsearch. Building for healthcare, procurement, and productivity.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-3">
            <MagneticButton
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-shadow"
            >
              View Projects <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </MagneticButton>
            <a href="/Vatsal_Chhatbar_Resume.pdf" download>
              <MagneticButton className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-white font-semibold hover:bg-white/10 transition-colors">
                <Download className="w-4 h-4" /> Download Resume
              </MagneticButton>
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="mt-10 flex items-center gap-5 text-slate-400">
            <a aria-label="GitHub" href="https://github.com/Vatsal1612" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a aria-label="LinkedIn" href="https://linkedin.com/in/vatsalchhatbar" target="_blank" rel="noreferrer" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a aria-label="Email" href="mailto:vatsalchhatbar1234@gmail.com" className="hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs mono"><MapPin className="w-3.5 h-3.5" /> Surat, India</span>
          </motion.div>
        </div>

        {/* Terminal Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="lg:col-span-5">
          <div className="relative animate-float">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-blue-500/40 via-indigo-500/30 to-cyan-400/30 blur-lg" />
            <Card className="relative bg-[#0b1220]/90 border-white/10 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/[0.03]">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs mono text-slate-400">~ vatsal — bash</span>
              </div>
              <div className="p-5 mono text-[13px] leading-6">
                <div><span className="text-emerald-400">➜ vatsal</span> <span className="text-cyan-400">whoami</span></div>
                <div className="text-slate-300">Vatsal Chhatbar · .NET Full Stack Developer</div>
                <div className="mt-2"><span className="text-emerald-400">➜ vatsal</span> <span className="text-cyan-400">cat</span> stack.json</div>
                <pre className="text-slate-300">{`{
  "backend": [".NET", "ASP.NET Core"],
  "language": "C#",
  "db": ["PostgreSQL", "MySQL"],
  "infra": ["RabbitMQ", "Redis", "Elasticsearch"],
  "focus": "microservices"
}`}</pre>
                <div className="mt-2"><span className="text-emerald-400">➜ vatsal</span> <span className="text-cyan-400">ls</span> projects/</div>
                <div className="text-slate-300">FarmBridge  Clinic-MS  Task-MS  Pharmacy-MS</div>
                <div className="mt-2"><span className="text-emerald-400">➜ vatsal</span><span className="cursor-blink" /></div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Section({ id, eyebrow, title, subtitle, children }) {
  return (
    <section id={id} className="relative py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }}
          className="mb-12 md:mb-16">
          <div className="text-xs mono uppercase tracking-[0.25em] text-cyan-400/80">{eyebrow}</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-black tracking-tight">{title}</h2>
          {subtitle && <p className="mt-3 text-slate-400 max-w-2xl">{subtitle}</p>}
        </motion.div>
        {children}
      </div>
    </section>
  );
}

function About() {
  const stats = [
    { label: 'Projects Shipped', value: 4, suffix: '+' },
    { label: 'Perf. Improvement', value: 25, suffix: '%' },
    { label: 'Modules Built', value: 5, suffix: '+' },
    { label: 'CGPA', value: 7.73, suffix: '' },
  ];
  return (
    <Section id="about" eyebrow="About Me" title="Engineered for scale, obsessed with craft."
      subtitle="I design and build production-grade backends and full-stack systems, mixing rigorous fundamentals with modern .NET and microservices patterns.">
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-7 gradient-border p-6 md:p-8">
          <p className="text-slate-300 leading-relaxed">
            Results-driven <span className="text-white">.NET Full Stack Developer</span> with hands-on experience building scalable web applications using{' '}
            <span className="text-white">ASP.NET Core MVC</span> and <span className="text-white">C#</span>. Skilled in modular systems, microservices architecture,
            RabbitMQ, Redis, Elasticsearch, and PostgreSQL. Delivered real-world projects across healthcare, procurement, and task management.
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl p-4 glass">
                <div className="text-2xl md:text-3xl font-black gradient-text">
                  <AnimatedCounter to={s.value} suffix={s.suffix} />
                </div>
                <div className="text-[11px] uppercase tracking-widest text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-5 space-y-4">
          <div className="gradient-border p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/15 grid place-items-center"><GraduationCap className="w-5 h-5 text-blue-400" /></div>
            <div>
              <div className="font-semibold">B.E. Computer Science</div>
              <div className="text-sm text-slate-400">Government Engineering College, Patan · CGPA 7.73</div>
            </div>
          </div>
          <div className="gradient-border p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/15 grid place-items-center"><Briefcase className="w-5 h-5 text-indigo-400" /></div>
            <div>
              <div className="font-semibold">Casepoint Pvt. Ltd. · Intern</div>
              <div className="text-sm text-slate-400">Full Stack Software Development · Jan 2026 – May 2026</div>
            </div>
          </div>
          <div className="gradient-border p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/15 grid place-items-center"><Sparkles className="w-5 h-5 text-cyan-400" /></div>
            <div>
              <div className="font-semibold">Recognition</div>
              <div className="text-sm text-slate-400">Governor Award · SIH College Rank 3</div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function Skills() {
  return (
    <Section id="skills" eyebrow="Tech Stack" title="Tools I use to ship." subtitle="A pragmatic toolbox for building fast, reliable, and observable systems.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(SKILLS).map(([group, meta], idx) => (
          <motion.div key={group} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }} className="gradient-border p-6 tilt-card">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.color} grid place-items-center shadow-lg`}>
                <meta.icon className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold text-lg">{group}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {meta.items.map((s) => (
                <Badge key={s} variant="secondary" className="bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10">{s}</Badge>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title=".NET Developer Experience" subtitle="Hands-on across the SDLC — from architecture to performance tuning.">
      <div className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/40 via-indigo-500/30 to-transparent" />
        {EXPERIENCE.map((e, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className={`relative grid md:grid-cols-2 gap-6 mb-10 ${i % 2 === 0 ? '' : 'md:[direction:rtl]'}`}>
            <div className={`md:[direction:ltr] ${i % 2 === 0 ? 'md:pr-10 md:text-right' : 'md:pl-10'}`}>
              <div className="gradient-border p-6">
                <div className="text-xs mono text-cyan-400/80">{e.period}</div>
                <h3 className="mt-1 text-xl font-bold">{e.role}</h3>
                <div className="text-slate-400">{e.company} · {e.location}</div>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {e.achievements.map((a) => (
                    <li key={a} className="flex gap-2"><CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" /><span>{a}</span></li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {e.tech.map((t) => <Badge key={t} className="bg-blue-500/10 text-blue-300 border-blue-500/20 hover:bg-blue-500/20">{t}</Badge>)}
                </div>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {e.metrics.map((m) => (
                    <div key={m.label} className="rounded-lg glass p-3 text-center">
                      <div className="text-lg font-black gradient-text">{m.value}</div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-400">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:block" />
            <div className="absolute left-4 md:left-1/2 top-6 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 ring-4 ring-[#0b1220]" />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function ProjectCard({ p, i }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: i * 0.06 }} className="gradient-border overflow-hidden tilt-card">
      <div className={`relative h-44 bg-gradient-to-br ${p.accent} overflow-hidden`}>
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl drop-shadow-2xl">{p.icon}</div>
        </div>
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          <div className="text-xs mono text-white/90">{p.tag}</div>
          <div className="text-[10px] mono text-white/80 uppercase tracking-widest">Case Study</div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold">{p.title}</h3>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">{p.description}</p>
        <ul className="mt-4 grid grid-cols-1 gap-1.5 text-sm text-slate-300">
          {p.features.map((f) => (
            <li key={f} className="flex gap-2"><Zap className="w-3.5 h-3.5 mt-1 text-cyan-400 shrink-0" /><span>{f}</span></li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.tech.map((t) => (
            <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 mono">{t}</span>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2">
          <a href={p.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg glass text-sm hover:bg-white/10">
            <Github className="w-4 h-4" /> Code
          </a>
          <a href={p.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 text-sm text-white hover:opacity-90">
            <ExternalLink className="w-4 h-4" /> Live Demo
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function Projects() {
  return (
    <Section id="projects" eyebrow="Projects" title="ASP.NET Core Projects" subtitle="A selection of real-world systems I've designed & built.">
      <div className="grid md:grid-cols-2 gap-6">
        {PROJECTS.map((p, i) => <ProjectCard key={p.title} p={p} i={i} />)}
      </div>
    </Section>
  );
}

function Achievements() {
  return (
    <Section id="achievements" eyebrow="Achievements" title="Milestones & recognition.">
      <div className="grid md:grid-cols-2 gap-6">
        {ACHIEVEMENTS.map((a, i) => (
          <motion.div key={a.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            className="relative glass rounded-2xl p-8 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-amber-500/20 border border-yellow-400/20 grid place-items-center">
                <a.icon className="w-7 h-7 text-yellow-300" />
              </div>
              <div>
                <div className="text-lg font-bold">{a.title}</div>
                <div className="text-slate-400">{a.detail}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Certifications() {
  return (
    <Section id="certifications" eyebrow="Certifications" title="Continuous learning.">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {CERTIFICATIONS.map((c, i) => (
          <motion.div key={c.title} initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className="gradient-border p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 grid place-items-center">
              <c.icon className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <div className="font-semibold">{c.title}</div>
              <div className="text-sm text-slate-400">{c.issuer}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function Blog() {
  return (
    <Section id="blog" eyebrow="Blog" title="C# and ASP.NET Core Tutorials"
      subtitle="Deep dives on the .NET stack — architecture, performance, and security.">
      <div className="grid md:grid-cols-2 gap-6">
        {BLOG_POSTS.map((b, i) => (
          <motion.article key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
            className="group gradient-border p-6 hover:bg-white/[0.02] transition-colors cursor-pointer">
            <div className="flex items-center gap-3 text-xs mono text-slate-400">
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300">{b.tag}</span>
              <span>{b.date}</span>
              <span>· {b.minutes} min read</span>
            </div>
            <h3 className="mt-3 text-xl font-bold group-hover:text-cyan-300 transition-colors">{b.title}</h3>
            <p className="mt-2 text-slate-400 text-sm leading-relaxed">{b.excerpt}</p>
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-cyan-300">
              Read article <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in name, email and message.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setSent(true);
      toast.success('Message sent! I\u2019ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 3500);
    } catch {
      toast.error('Could not send. Try again or email me directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id="contact" eyebrow="Contact" title="Hire .NET Developer India" subtitle="Have a role, project, or collaboration in mind? Let\u2019s talk.">
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[
            { icon: Mail, label: 'Email', value: 'vatsalchhatbar1234@gmail.com', href: 'mailto:vatsalchhatbar1234@gmail.com' },
            { icon: Phone, label: 'Phone', value: '+91 9316578854', href: 'tel:+919316578854' },
            { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/vatsalchhatbar', href: 'https://linkedin.com/in/vatsalchhatbar' },
            { icon: Github, label: 'GitHub', value: 'github.com/Vatsal1612', href: 'https://github.com/Vatsal1612' },
          ].map((c) => (
            <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
              className="gradient-border p-4 flex items-center gap-4 hover:bg-white/[0.03] transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500/20 grid place-items-center"><c.icon className="w-5 h-5 text-blue-300" /></div>
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-400">{c.label}</div>
                <div className="font-medium text-slate-100 text-sm break-all">{c.value}</div>
              </div>
            </a>
          ))}
        </div>
        <form onSubmit={submit} className="lg:col-span-3 gradient-border p-6 md:p-8 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe" className="mt-1 bg-white/5 border-white/10" />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-slate-400">Email</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@company.com" className="mt-1 bg-white/5 border-white/10" />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-slate-400">Subject</label>
            <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder=".NET Developer Role at Acme" className="mt-1 bg-white/5 border-white/10" />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-slate-400">Message</label>
            <Textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell me a bit about the opportunity..." className="mt-1 bg-white/5 border-white/10" />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">Usually respond within 24 hours.</div>
            <Button type="submit" disabled={loading}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:opacity-90">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending</> : sent ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Sent</> : <>Send Message <ArrowRight className="w-4 h-4 ml-2" /></>}
            </Button>
          </div>
        </form>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="relative border-t border-white/5 mt-10">
      <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-500">© {new Date().getFullYear()} Vatsal Chhatbar · Built with <span className="text-white">Next.js</span> & <span className="text-white">Tailwind</span></div>
        <div className="flex items-center gap-4 text-slate-400">
          <a aria-label="GitHub" href="https://github.com/Vatsal1612" className="hover:text-white"><Github className="w-5 h-5" /></a>
          <a aria-label="LinkedIn" href="https://linkedin.com/in/vatsalchhatbar" className="hover:text-white"><Linkedin className="w-5 h-5" /></a>
          <a aria-label="Email" href="mailto:vatsalchhatbar1234@gmail.com" className="hover:text-white"><Mail className="w-5 h-5" /></a>
        </div>
      </div>
    </footer>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const s = () => setShow(window.scrollY > 500);
    window.addEventListener('scroll', s);
    return () => window.removeEventListener('scroll', s);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 grid place-items-center shadow-lg shadow-blue-500/40 hover:scale-110 transition-transform"
          aria-label="Back to top"
        ><ChevronUp className="w-5 h-5 text-white" /></motion.button>
      )}
    </AnimatePresence>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return <motion.div style={{ scaleX }} className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400" />;
}

function CommandPalette({ open, setOpen }) {
  const [q, setQ] = useState('');
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOpen((v) => !v); }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [setOpen]);
  const items = useMemo(() => [
    ...NAV.map((n) => ({ type: 'Section', label: n.label, action: () => document.getElementById(n.id)?.scrollIntoView({ behavior: 'smooth' }) })),
    { type: 'Action', label: 'Download Resume', action: () => { const a = document.createElement('a'); a.href = '/Vatsal_Chhatbar_Resume.pdf'; a.download = 'Vatsal_Chhatbar_Resume.pdf'; a.click(); } },
    { type: 'Link', label: 'GitHub', action: () => window.open('https://github.com/Vatsal1612', '_blank') },
    { type: 'Link', label: 'LinkedIn', action: () => window.open('https://linkedin.com/in/vatsalchhatbar', '_blank') },
    { type: 'Link', label: 'Email', action: () => window.open('mailto:vatsalchhatbar1234@gmail.com') },
  ], []);
  const filtered = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm grid place-items-start pt-24 px-4"
          onClick={() => setOpen(false)}>
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg mx-auto glass rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
              <Search className="w-4 h-4 text-slate-400" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Type a command or search…"
                className="flex-1 bg-transparent outline-none text-sm" />
              <kbd className="text-[10px] mono px-1.5 py-0.5 rounded bg-white/10">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {filtered.length === 0 && <div className="p-6 text-sm text-slate-400 text-center">No results.</div>}
              {filtered.map((it) => (
                <button key={it.label} onClick={() => { it.action(); setOpen(false); }}
                  className="w-full flex items-center justify-between text-left px-4 py-2.5 hover:bg-white/5">
                  <span className="text-sm">{it.label}</span>
                  <span className="text-[10px] mono uppercase tracking-widest text-slate-500">{it.type}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------- MAIN ------------------- */
export default function App() {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState('home');
  const [cmd, setCmd] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    NAV.forEach((n) => { const el = document.getElementById(n.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [ready]);

  return (
    <>
      <Splash done={ready} />
      <Cursor />
      <ScrollProgress />
      <Navbar active={active} onOpenCmd={() => setCmd(true)} />
      <CommandPalette open={cmd} setOpen={setCmd} />
      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Achievements />
        <Certifications />
        <Blog />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
