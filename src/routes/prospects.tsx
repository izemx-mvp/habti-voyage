import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { ProspectsView } from "@/components/habti/views/prospects";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/prospects")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Prospects — Habti Voyage" },
    { name: "description", content: "Qualification, scoring et suivi commercial des opportunités Habti Voyage." },
    { property: "og:title", content: "Prospects — Habti Voyage" },
    { property: "og:description", content: "Pipeline commercial, relances et conversion des demandes de voyage." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/prospects"><ProspectsView /></HabtiShell>,
});
