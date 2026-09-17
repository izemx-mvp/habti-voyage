import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { AgentCommunityManagerView } from "@/components/habti/views/agent-community-manager";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/agent-community-manager")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Agent Community Manager — Habti Voyage" },
    { name: "description", content: "Planning éditorial, publications sociales et idées IA Habti Voyage." },
    { property: "og:title", content: "Agent Community Manager — Habti Voyage" },
    { property: "og:description", content: "Produisez, validez et planifiez les contenus sociaux HABTI." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
});

function Page() {
  return <HabtiShell path="/agent-community-manager"><AgentCommunityManagerView /></HabtiShell>;
}
