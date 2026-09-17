import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { OperationDetailView } from "@/components/habti/views/entity-detail";

export const Route = createFileRoute("/operations/$id")({
  head: () => ({ meta: [
    { title: "Détail opération — Habti Voyage" },
    { name: "description", content: "Fiche complète opérationnelle Habti Voyage." },
    { property: "og:title", content: "Détail opération — Habti Voyage" },
    { property: "og:description", content: "Brief terrain, checklist, équipe, finance et suggestions IA validées." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  return <HabtiShell path="/operations"><OperationDetailView id={id} /></HabtiShell>;
}
