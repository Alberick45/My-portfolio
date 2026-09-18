import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function localApiPlugin(): Plugin {
  return {
    name: 'local-api-handler',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method === 'POST' && req.url === '/api/posts') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              if (parsed.posts) {
                const filePath = path.resolve(__dirname, 'public/posts.json');
                fs.writeFileSync(filePath, JSON.stringify(parsed.posts, null, 2), 'utf-8');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ detail: 'Posts updated locally on disk' }));
                return;
              }
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ detail: err.message }));
              return;
            }
          });
          return;
        }

        if (req.method === 'POST' && req.url === '/api/roadmap') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              if (parsed.roadmap) {
                const filePath = path.resolve(__dirname, 'public/roadmap.json');
                fs.writeFileSync(filePath, JSON.stringify(parsed.roadmap, null, 2), 'utf-8');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ detail: 'Roadmap updated locally on disk' }));
                return;
              }
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ detail: err.message }));
              return;
            }
          });
          return;
        }

        if (req.method === 'POST' && req.url === '/api/upload') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              if (parsed.filename && parsed.fileContent) {
                const ext = path.extname(parsed.filename);
                const randomHex = Math.random().toString(36).substring(2, 10);
                const uniqueFilename = `upload_${randomHex}${ext}`;
                const imagesDir = path.resolve(__dirname, 'public/images');
                if (!fs.existsSync(imagesDir)) {
                  fs.mkdirSync(imagesDir, { recursive: true });
                }
                const filePath = path.join(imagesDir, uniqueFilename);
                fs.writeFileSync(filePath, Buffer.from(parsed.fileContent, 'base64'));

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  url: `/images/${uniqueFilename}`,
                  filename: uniqueFilename,
                  source: 'local_disk'
                }));
                return;
              }
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ detail: err.message }));
              return;
            }
          });
          return;
        }

        if (req.method === 'POST' && req.url === '/api/visitors') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              if (parsed.name) {
                const filePath = path.resolve(__dirname, 'public/visitors.json');
                let visitors = [];
                if (fs.existsSync(filePath)) {
                  try {
                    visitors = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                  } catch (e) {
                    visitors = [];
                  }
                }
                const newEntry = {
                  id: `vis_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                  name: parsed.name,
                  email: parsed.email || '',
                  timestamp: parsed.timestamp || new Date().toISOString(),
                  userAgent: parsed.userAgent || ''
                };
                visitors.unshift(newEntry);
                fs.writeFileSync(filePath, JSON.stringify(visitors, null, 2), 'utf-8');

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ detail: 'Visitor logged to disk', entry: newEntry }));
                return;
              }
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ detail: err.message }));
              return;
            }
          });
          return;
        }


        next();
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), localApiPlugin()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});

