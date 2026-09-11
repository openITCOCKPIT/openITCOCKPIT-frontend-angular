# ai_module

The interface for AiModule, an AI assistant for openITCOCKPIT: a chat against a
configured agent, and the administration behind it.

## Status

**A mockup.** It exists so the look and the behaviour can be judged on a real
instance: every screen is real and talks to a real backend.

The backend lives in its own repository and has to be installed alongside;
without it these routes lead nowhere. The route guard in `ai-module.guard.ts`
redirects to the dashboard where the module is not installed.

## What was added

| Path | Contents |
|---|---|
| `pages/aichat` | the chat and the approval queue |
| `pages/aichatsessions` | past conversations, filtered by agent |
| `pages/aiagents` | define an agent: purpose, provider, MCP instance |
| `pages/aillmproviders` | OpenAI-compatible endpoints |
| `pages/aimcpservers` | MCP instances and their tool catalogue |
| `pages/aiauditlog` | what the assistant did |
| `pages/aisettings` | module globals |
| `ai_module.routes.ts` | the routes, all behind `aiModuleGuard` |
| `ai-module.guard.ts` | hides the routes where the module is absent |

Outside this directory:

- `app.routes.ts` spreads in `aiModuleRoutes`
- `app.config.ts` adds `provideMarkdown()`
- `package.json` adds `ngx-markdown` and `marked`, pinned to the majors that
  match Angular 21
- `assets/i18n/*.json` gain the module's strings in all seven languages

## Worth knowing about the chat

An answer is never waited for. Sending a message enqueues a turn in the backend
and returns; the component polls until the turn is terminal. A model can spend a
minute thinking, and holding the request open would hold a PHP-FPM worker with
it.

A conversation has its own URL, so leaving the page does not lose it and an
approval can link into the conversation it belongs to. The list beside the chat
refreshes when a message is sent and again when the turn ends, the second time
to pick up the title the backend wrote for it.

Answers render as Markdown with sanitizing left on: the text carries host names
and check output out of the monitoring system, so it is untrusted input.
