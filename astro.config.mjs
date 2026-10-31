import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://avexel.co',
  output: 'static',
  server: { host: '0.0.0.0', port: 4321 },
  vite: { server: { allowedHosts: ['.loca.lt', '.localtunnel.me'] } },
});
