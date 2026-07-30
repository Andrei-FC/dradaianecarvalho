# Componentes — mapeamento Figma → código

A organização aqui **espelha a página "01 - Components" do Figma**. Ao criar uma
página nova, o padrão é: reusar estes componentes e só ajustar conteúdo/cor via props.

## Blocos reutilizáveis (átomos)

| Figma | Arquivo | Props principais |
|---|---|---|
| Título de Seção | `TituloSecao.astro` | `label`, `titulo`, `subtitulo?`, `centralizado?` |
| Card Avaliação | `CardAvaliacao.astro` | `nome`, `depoimento` |
| Card Destaque | `CardDestaque.astro` | `titulo`, `texto`, `cor` (`mauve` \| `teal`) |
| Botão WhatsApp | `BotaoWhatsApp.astro` | `texto`, `mensagem`, `posicao`, `icone?` |

## Seções (repetem entre páginas)

| Figma | Arquivo | Observação |
|---|---|---|
| Seção · Depoimentos | `Depoimentos.astro` | itera `data/avaliacoes.json` |
| Seção · Dra | `Dra.astro` | Instagram vem de `data/clinica.json` |
| Seção · Resultados | `Resultados.astro` | galeria full-bleed; título por prop |
| Seção · Espaço | `Espaco.astro` | (antes "Consultório") |
| Seção · FAQ | `FAQ.astro` | recebe `itens` (perguntas variam por página) |
| Seção · Rodapé | `Rodape.astro` | endereço/mapa de `data/clinica.json` |
| Barra fixa (mobile) | `BarraFixa.astro` | CTA de WhatsApp fixo |

## Específicos da landing /clareamento

Ficam em `clareamento/`: `Hero`, `SelosGrid`, `SelosMobile`, `Incluso`,
`Destaque` (wrapper que usa `CardDestaque` cor mauve), `Branco`, `Funciona`.

## Convenções

- **Variante de breakpoint do Figma (Mobile/Desktop) NÃO vira componente.**
  No código é um componente só, responsivo via media query. As duas variantes
  do Figma existem só para validar o design nos dois tamanhos.
- **Variante que muda cor/conteúdo vira prop** (ex.: `CardDestaque` cor).
- **Dados que se repetem** (telefone, endereço, wa.me, avaliações) ficam em
  `src/data/` — nunca hardcoded no componente.
- **Eyebrow (label de seção) é mauve** (`--marca-acento`), como no Figma.
- CSS de cada seção fica junto do componente via `<style is:global>`
  (global, não escopado — preserva nomes de classe). Primitivos de layout
  compartilhados: `src/styles/base.css`. Tokens: `src/styles/tokens.css`.
