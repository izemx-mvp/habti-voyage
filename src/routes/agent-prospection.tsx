import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { AgentProspectionView } from "@/components/habti/views/agent-prospection";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/agent-prospection")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Agent de prospection IA — Habti Voyage" },
    { name: "description", content: "Qualifiez automatiquement les demandes de voyage entrantes avec l'agent IA Habti Voyage." },
    { property: "og:title", content: "Agent de prospection IA — Habti Voyage" },
    { property: "og:description", content: "Conversation guidée, extraction de la demande et création de prospect en un clic." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/agent-prospection"><AgentProspectionView /></HabtiShell>,
});
