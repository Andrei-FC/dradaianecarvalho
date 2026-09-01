import { defineConfig } from 'astro/config';

// Site estático puro. Sem JS de framework no cliente por padrão.
// O build gera HTML em dist/ — é o que o Cloudflare Pages serve.
export default defineConfig({
  site: 'https://dradaianecarvalho.com.br',
  build: {
    // gera /clareamento/index.html em vez de /clareamento.html
    format: 'directory',
    // Embute o CSS no <head> em vez de servir como arquivo separado. São ~18KB
    // no total: menor que o custo de duas requisições bloqueantes de renderização
    // num 4G lento. Se o CSS crescer muito, reavaliar — o ponto de virada fica
    // por volta de 50KB.
    inlineStylesheets: 'always',
  },
});
