import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { ClientDetailView } from "@/components/habti/views/entity-detail";

export const Route = createFileRoute("/clients/$id")({
  head: () => ({ meta: [
    { title: "Détail client — Habti Voyage" },
    { name: "description", content: "Fiche complète client Habti Voyage." },
    { property: "og:title", content: "Détail client — Habti Voyage" },
    { property: "og:description", content: "Historique, réservations, documents financiers et conversations." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  return <HabtiShell path="/clients"><ClientDetailView id={id} /></HabtiShell>;
}
