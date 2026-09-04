import './globals.css';
import { Toaster } from 'sonner';

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://vatsalchhatbar.dev';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'VATSAL J. CHHATBAR | .NET Full Stack Developer Portfolio',
    template: '%s | VATSAL J. CHHATBAR',
  },
  description:
    '.NET Full Stack Developer specializing in ASP.NET Core MVC, C#, PostgreSQL, RabbitMQ, Redis, Elasticsearch, and scalable microservices web applications.',
  keywords: [
    '.NET Developer', 'ASP.NET Core Developer', 'C# Developer',
    'Full Stack Developer India', 'PostgreSQL Developer',
    'RabbitMQ Developer', 'Redis', 'Elasticsearch',
    'Microservices', 'Software Engineer Surat',
    'Vatsal J. Chhatbar', '.NET Full Stack Developer Portfolio',
  ],
  authors: [{ name: 'Vatsal J. Chhatbar', url: SITE_URL }],
  creator: 'VATSAL J. CHHATBAR',
  publisher: 'VATSAL J. CHHATBAR',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'Vatsal Chhatbar | .NET Full Stack Developer Portfolio',
    description:
      '.NET Full Stack Developer building scalable ASP.NET Core MVC apps with C#, PostgreSQL, RabbitMQ, Redis, Elasticsearch & microservices.',
    siteName: 'VATSAL J. CHHATBAR',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vatsal Chhatbar | .NET Full Stack Developer',
    description:
      '.NET Full Stack Developer — ASP.NET Core, C#, PostgreSQL, Microservices.',
    creator: '@vatsalchhatbar',
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: '/favicon.png', type: 'image/png' }],
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export const viewport = {
  themeColor: '#0b1220',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: 'VATSAL J. CHHATBAR',
      url: SITE_URL,
      jobTitle: '.NET Full Stack Developer',
      email: 'mailto:vatsalchhatbar1234@gmail.com',
      telephone: '+91-9316578854',
      sameAs: [
        'https://linkedin.com/in/vatsalchhatbar',
        'https://github.com/Vatsal1612',
      ],
      knowsAbout: [
        'C#', '.NET', 'ASP.NET Core', 'ASP.NET Core MVC',
        'PostgreSQL', 'MySQL', 'RabbitMQ', 'Redis', 'Elasticsearch',
        'Microservices', 'REST APIs', 'JavaScript',
      ],
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'Government Engineering College Patan',
      },
      address: { '@type': 'PostalAddress', addressCountry: 'IN' },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'VATSAL J. CHHATBAR — .NET Full Stack Developer Portfolio',
      description: '.NET Full Stack Developer Portfolio',
      publisher: { '@id': `${SITE_URL}/#person` },
      inLanguage: 'en-US',
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#brand`,
      name: 'VATSAL J. CHHATBAR',
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.png`,
      founder: { '@id': `${SITE_URL}/#person` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE_URL}/#projects` },
        { '@type': 'ListItem', position: 3, name: 'Experience', item: `${SITE_URL}/#experience` },
        { '@type': 'ListItem', position: 4, name: 'Contact', item: `${SITE_URL}/#contact` },
      ],
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}
