import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

// Local development mock for Cloudflare D1 /api/items when running in Vite dev server
function localD1DevPlugin(): Plugin {
  const localItems = [
    {
      id: 1,
      title: 'বন্ধন গ্রীন ভ্যালি আবাসন প্রকল্প',
      description: 'ঢাকা-মাওয়া এক্সপ্রেসওয়ে সংলগ্ন আধুনিক সুযোগ-সুবিধা সম্বলিত ১০০% নির্ভেজাল সাব-কবলা প্লট।',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      link: 'https://example.com/project-1',
      created_at: '2026-03-15 10:00:00'
    },
    {
      id: 2,
      title: 'পদ্মা রিভারভিউ ইকো রিসোর্ট সমবায়',
      description: 'পদ্মা সেতুর অদূরে পরিবেশবান্ধব ইকো ট্যুরিজম ও সমবায় কৃষি খামার প্রকল্প। শেয়ার ক্রয়ে নিয়মিত লভ্যাংশ।',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      link: 'https://example.com/project-2',
      created_at: '2026-03-20 12:30:00'
    },
    {
      id: 3,
      title: 'সঞ্চয় ও শেয়ার বিনিয়োগ ক্যাম্পেইন ২০২৬',
      description: 'বন্ধন ও বিনিয়োগ বহুমুখী সমবায় সমিতি লিঃ এর বিশেষ শেয়ার বৃদ্ধি ক্যাম্পেইন। নিশ্চিত সঞ্চয় ও অগ্রগতি।',
      image: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?auto=format&fit=crop&w=800&q=80',
      link: 'https://example.com/project-3',
      created_at: '2026-03-25 15:45:00'
    }
  ];

  return {
    name: 'local-d1-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/items', (req, res, next) => {
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true, items: localItems }));
          return;
        }
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const newItem = {
                id: Date.now(),
                title: parsed.title || 'Untitled',
                description: parsed.description || '',
                image: parsed.image || '',
                link: parsed.link || '',
                created_at: new Date().toISOString()
              };
              localItems.unshift(newItem);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(JSON.stringify({ success: true, item: newItem, message: 'Saved to D1' }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), localD1DevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
