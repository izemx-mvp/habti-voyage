import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { EmployeDetailView } from "@/components/habti/views/entity-detail";

export const Route = createFileRoute("/employes/$id")({
  head: () => ({ meta: [
    { title: "Détail employé — Habti Voyage" },
    { name: "description", content: "Profil complet employé Habti Voyage." },
    { property: "og:title", content: "Détail employé — Habti Voyage" },
    { property: "og:description", content: "Disponibilité, charge, spécialités et missions affectées." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  return <HabtiShell path="/employes"><EmployeDetailView id={id} /></HabtiShell>;
}
