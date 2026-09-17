import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { DevisDetailView } from "@/components/habti/views/entity-detail";

export const Route = createFileRoute("/devis/$id")({
  head: () => ({ meta: [
    { title: "Détail devis — Habti Voyage" },
    { name: "description", content: "Fiche complète devis Habti Voyage." },
    { property: "og:title", content: "Détail devis — Habti Voyage" },
    { property: "og:description", content: "Aperçu document, lignes, totaux et actions commerciales." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  return <HabtiShell path="/devis"><DevisDetailView id={id} /></HabtiShell>;
}
