import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { MissionsView } from "@/components/habti/views/missions";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/operations")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Opérations — Habti Voyage" },
    { name: "description", content: "Command center terrain, checklists et équipes Habti Voyage." },
    { property: "og:title", content: "Opérations — Habti Voyage" },
    { property: "og:description", content: "Pilotez les opérations, tâches et validations IA terrain." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
});

function Page() {
  return <HabtiShell path="/operations"><MissionsView /></HabtiShell>;
}
