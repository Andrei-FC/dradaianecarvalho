import { defineConfig } from 'astro/config';

// Site estático puro. Sem JS de framework no cliente por padrão.
// O build gera HTML em dist/ — é o que o Cloudflare Pages serve.
export default defineConfig({
  site: 'https://dradaianecarvalho.com.br',
  build: {
    // gera /clareamento/index.html em vez de /clareamento.html
    format: 'directory',
  },
});
