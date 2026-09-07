# 🎂 Festa de 1 Aninho — Organizador

App web (PWA) para organizar a festa de 1 ano: convidados, checklist, gastos,
calculadora de quantidades, anotações, resumo em gráficos e um assistente com IA.
Tem também uma **página de confirmação de presença** (`confirmar.html`) para
mandar aos convidados.

- Funciona no celular, instala na tela de início e roda offline.
- Todos os dados ficam salvos **no próprio aparelho** (localStorage) — sem conta, sem servidor.

Arquivo único (para enviar por WhatsApp/e-mail): `Festa-1-Aninho.html`.

## 💌 Confirmação de presença

`confirmar.html` é uma página separada, para mandar por WhatsApp aos convidados:
eles dizem se vão, quantos adultos e crianças, e deixam um recado. As respostas
caem numa planilha do Google e você traz tudo para o app com um toque
(**Convidados ▸ 🔗 Confirmações ▸ Buscar respostas**), conferindo cada uma antes
de aplicar. Nenhum convidado precisa instalar nada nem ter conta.

Um link só serve para todo mundo — o convidado digita o próprio nome, e o app
casa com quem já está na sua lista pelo nome ou pelo telefone.

### 1. Criar o script

Não precisa criar planilha nenhuma antes — o script cria a dele sozinho.

1. Abra [script.google.com](https://script.google.com) e clique em **Novo projeto**.
2. Apague o `function myFunction() {}` e cole todo o conteúdo de
   [`apps-script/Codigo.gs`](apps-script/Codigo.gs). Salve (💾).
3. Clique em **Implantar ▸ Nova implantação**, engrenagem ⚙ ▸ **App da Web**:
   - *Executar como*: **Eu**
   - *Quem pode acessar*: **Qualquer pessoa** ← precisa ser este, senão os
     convidados recebem erro
4. **Implantar** e autorize (a tela de "app não verificado" é o seu próprio
   script: **Avançado ▸ Acessar…**).
5. Copie o **URL do app da Web** — termina em `/exec`, não em `/dev`.

**Onde ficam as respostas?** Na primeira confirmação que chegar, o script cria
uma planilha chamada **Festa 1 Aninho — Confirmações** no seu Google Drive e
passa a usar sempre essa. Para abrir: no editor do Apps Script, escolha a função
`linkDaPlanilha` na caixinha do topo, clique em **▶ Executar** e o endereço
aparece no *Registro de execução*.

> Ao mudar o `Codigo.gs` depois, use **Implantar ▸ Gerenciar implantações ▸ ✏️ ▸
> Versão: Nova versão**, senão o endereço continua servindo o código antigo. Se a
> lista de permissões mudar, o Google pede autorização de novo.

Se preferir uma planilha que já existe, dá para colar o mesmo código nela
(**Extensões ▸ Apps Script**) — aí o script usa essa planilha em vez de criar uma.

### 2. Preparar a página do convite

No começo do `<script>` de `confirmar.html`, preencha:

- `ENDPOINT` — o URL `/exec` que você copiou.
- `FESTA` — nome da aniversariante, data, hora, local, endereço, link do mapa e
  um recado. O que ficar vazio simplesmente não aparece.

Publique o arquivo em qualquer lugar que sirva HTML. Se o repositório estiver no
GitHub Pages (*Settings ▸ Pages ▸ Deploy from a branch*), o link já fica pronto:
`https://SEU-USUARIO.github.io/festa-1-aninho/confirmar.html`.

### 3. Convidar e importar

Na aba **Convidados**, toque em **🔗 Confirmações**, cole o link do convite e o
endereço `/exec`, e salve. Dali dá para copiar o link, mandar direto no WhatsApp
e buscar as respostas quando quiser — cada resposta só aparece uma vez, e você
escolhe se ela cria um convidado novo ou atualiza um que já existe.

### Detalhes

- As confirmações ficam **na sua planilha**, na sua conta Google. Dá para
  acompanhar por lá também, sem abrir o app.
- Grátis: o Apps Script e o GitHub Pages não cobram nada nesse volume.
- O convidado não precisa de conta, senha nem app.
- Quem responde no mesmo aparelho vê a própria resposta e pode alterá-la — o
  reenvio vira uma linha nova na planilha, e vale a última que você importar.
- Nada de senha ou dado sensível passa por aí: quem tiver o link consegue enviar
  uma confirmação, então é um link para compartilhar com os convidados, não para
  publicar aberto na internet.

## ✨ Assistente (opcional)

A aba **Assistente** responde perguntas sobre a festa ("quanto já gastei?",
"quem ainda não confirmou?") e também **anota as coisas por você** — convidados,
gastos, tarefas e anotações — a partir de um pedido em texto. Toda alteração
aparece na conversa e pode ser desfeita com um toque.

Para usar, é preciso uma chave de API da OpenAI
([platform.openai.com/api-keys](https://platform.openai.com/api-keys)):
abra a aba Assistente e toque em **🔑 Configurar chave**.

- A chave fica guardada **só naquele aparelho** (localStorage) — ela nunca entra
  neste repositório e não é enviada a mais ninguém além da API da OpenAI.
- Modelo: `gpt-5.6-luna` pela Responses API, com `reasoning.effort` em `none`.
  Cada pergunta custa menos de 1 centavo. Se ela errar comandos, suba o
  `AI_EFFORT` no código para `"low"`.
- `store: false` — a conversa não fica guardada nos servidores da OpenAI.
- O assistente precisa de internet; o resto do app continua funcionando offline.
- Para responder, os dados da festa (nomes, valores, tarefas) são enviados à API
  da OpenAI a cada pergunta.
- Se o app for publicado num endereço público, qualquer pessoa que abrir o site
  usa a **própria** chave — a sua continua só no seu aparelho. Para uma chave
  compartilhada entre várias pessoas, o certo seria um proxy no servidor.
- Vale definir um limite de gasto mensal em
  [platform.openai.com](https://platform.openai.com/settings/organization/limits).
