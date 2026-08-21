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

Para usar, é preciso uma chave de API da Anthropic
([console.anthropic.com](https://console.anthropic.com/settings/keys)):
abra a aba Assistente e toque em **🔑 Configurar chave**.

- A chave fica guardada **só naquele aparelho** (localStorage) — ela nunca entra
  neste repositório e não é enviada a mais ninguém além da API da Anthropic.
- Modelo usado: `claude-haiku-4-5`. Cada pergunta custa em torno de R$ 0,04.
- O assistente precisa de internet; o resto do app continua funcionando offline.
- Para responder, os dados da festa (nomes, valores, tarefas) são enviados à API
  da Anthropic a cada pergunta.
- Se o app for publicado num endereço público, qualquer pessoa que abrir o site
  usa a **própria** chave — a sua continua só no seu aparelho. Para uma chave
  compartilhada entre várias pessoas, o certo seria um proxy no servidor.
