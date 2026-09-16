import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { MissionsView } from "@/components/habti/views/missions";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/missions")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Missions & opérations — Habti Voyage" },
    { name: "description", content: "Affectations terrain, checklists et suivi logistique des missions Habti Voyage." },
    { property: "og:title", content: "Missions & opérations — Habti Voyage" },
    { property: "og:description", content: "Pilotez la réalisation des prestations et l'affectation des équipes." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/missions"><MissionsView /></HabtiShell>,
});
