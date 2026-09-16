# Habti Voyage product interface

## Build
- Create a premium desktop-first operations dashboard using Habti Voyage’s midnight, emerald, and warm-neutral brand system.
- Build a responsive shell with grouped sidebar navigation, global search, notifications, profile controls, and a restrained mirrored light-wave background.
- Make every requested section reachable inside the product, with purpose-built views for CRM, AI assistants, planning, catalog, quotes, finance, support, missions, team scheduling, analytics, and settings.
- Add realistic demo data, polished empty/loading states, drawers, filters, tabs, timeline, calendar, Kanban, tables, charts, quote/payment panels, and useful quick actions.

## AI conversations and persistence
- Use separate conversation threads per prospect/customer, each with a stable dedicated URL.
- Store threads and complete message history in Lovable Cloud, scoped to the signed-in user.
- Build the visible conversation surfaces from AI Elements, including streaming markdown, reasoning/loading feedback, and collapsed tool activity.
- Add a server-streamed AI assistant using the Lovable AI Gateway, with full conversation context sent on every turn.

## Technical details
- Use TanStack Start routes and a shared responsive application shell.
- Add authentication for private business data, row-level access rules, and secure thread/message tables.
- Define all visual values as semantic Tailwind v4 tokens; use existing component primitives and Recharts where appropriate.
- Verify compilation, key interactions, desktop and mobile layouts, conversation persistence, and preview runtime health.
