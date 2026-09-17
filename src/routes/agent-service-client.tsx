import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { AgentServiceClientView } from "@/components/habti/views/agent-service-client";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/agent-service-client")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Agent Service Client — Habti Voyage" },
    { name: "description", content: "Conversations, FAQ et base de connaissances client Habti Voyage." },
    { property: "og:title", content: "Agent Service Client — Habti Voyage" },
    { property: "og:description", content: "Gérez les conversations omnicanales avec relais humain et réponses assistées." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
});

function Page() {
  return <HabtiShell path="/agent-service-client"><AgentServiceClientView /></HabtiShell>;
}
