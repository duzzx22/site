# Site

Site estático em HTML, CSS e JavaScript, sem dependências nem etapa de build.

## Arquivos

- `public/` — arquivos publicados pela Cloudflare Pages.
- `public/music.mp3` — adicione aqui a faixa local para usar o player.
- `wrangler.toml` — configura `public/` como diretório de publicação.

As quatro abas são espaços vazios prontos para personalização; a terceira mostra
“Em breve”. O player fica fora das abas e oferece reprodução, pausa, volume e
repetição da faixa. Não há integração ou API de IA.

## Testar localmente

Adicione `music.mp3` à pasta `public/` e execute na raiz do projeto:

```sh
python3 -m http.server 8000 --directory public
```

Abra `http://localhost:8000`. A reprodução começa somente após acionar o botão.

## Cloudflare Pages

Configure o projeto Cloudflare Pages conectado ao repositório com:

- Branch de produção: `main`.
- Diretório raiz: `/` (raiz do repositório).
- Comando de build: vazio; o site não precisa de etapa de compilação.
- Diretório de saída: `public`.

O `wrangler.toml` identifica `public/` como diretório de publicação do Pages.
Não use `wrangler deploy`: este projeto é um site estático para Pages, não um
Worker. A publicação pelo Git exige que os arquivos estejam na branch remota.
