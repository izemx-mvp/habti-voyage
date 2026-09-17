import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { CampagneDetailView } from "@/components/habti/views/entity-detail";

export const Route = createFileRoute("/campagnes/$id")({
  head: () => ({ meta: [
    { title: "Détail campagne — Habti Voyage" },
    { name: "description", content: "Fiche complète de campagne commerciale Habti Voyage." },
    { property: "og:title", content: "Détail campagne — Habti Voyage" },
    { property: "og:description", content: "Message, audience, statut et performance de la campagne." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  return <HabtiShell path="/campagnes"><CampagneDetailView id={id} /></HabtiShell>;
}
