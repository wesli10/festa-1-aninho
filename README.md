# 🎂 Festa de 1 Aninho — Organizador

App web (PWA) para organizar a festa de 1 ano: convidados, checklist, gastos,
calculadora de quantidades, anotações, resumo em gráficos e um assistente com IA.

- Funciona no celular, instala na tela de início e roda offline.
- Todos os dados ficam salvos **no próprio aparelho** (localStorage) — sem conta, sem servidor.

Arquivo único (para enviar por WhatsApp/e-mail): `Festa-1-Aninho.html`.

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
