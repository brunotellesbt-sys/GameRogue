# POKELIKE - GitHub Pages Edition

Versão estática de um roguelike autobattler estilo Pokémon feita para rodar direto no GitHub Pages.

## Como publicar no GitHub Pages

1. Crie um repositório novo no GitHub.
2. Envie estes arquivos para a raiz do repositório:
   - `index.html`
   - `style.css`
   - `game.js`
   - `.nojekyll`
3. No GitHub, abra **Settings > Pages**.
4. Em **Build and deployment**, selecione:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/** root
5. Salve e aguarde o link do GitHub Pages aparecer.

## Como rodar localmente

Basta abrir `index.html` no navegador.

Se quiser testar como servidor local:

```bash
python -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## O que vem no jogo

- Normal Mode
- Nuzlocke
- Battle Tower
- Rotas aleatórias com batalha, captura, item, cura, troca e tutor
- Batalhas automáticas por turnos
- Vantagem/desvantagem de tipos
- Evolução por nível
- Itens ativos e passivos
- Pokédex local
- Conquistas
- Hall of Fame
- Save local no navegador
- Exportar/importar save code
- Layout responsivo para celular

## Observação importante

Este pacote não depende de backend. Ele usa `localStorage` para salvar progresso no navegador. Os sprites são carregados em tempo de execução de repositórios públicos da PokéAPI/GitHub.

Projeto fan-made. Não afiliado, endossado ou patrocinado pela Nintendo, Game Freak ou The Pokémon Company.
