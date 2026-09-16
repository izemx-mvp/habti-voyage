import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { PlanningView } from "@/components/habti/views/planning";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/planning")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Planning — Habti Voyage" },
    { name: "description", content: "Calendrier jour, semaine et mois des activités, équipes et affectations Habti Voyage." },
    { property: "og:title", content: "Planning — Habti Voyage" },
    { property: "og:description", content: "Vue calendrier interactive des prestations et des affectations terrain." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/planning"><PlanningView /></HabtiShell>,
});
