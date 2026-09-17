import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { EmployesView } from "@/components/habti/views/employes";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/employes/")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Employés & planning — Habti Voyage" },
    { name: "description", content: "Équipe, disponibilités, compétences et charge de travail des guides Habti Voyage." },
    { property: "og:title", content: "Employés & planning — Habti Voyage" },
    { property: "og:description", content: "Annuaire, planning hebdomadaire et affectation des collaborateurs." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/employes"><EmployesView /></HabtiShell>,
});
