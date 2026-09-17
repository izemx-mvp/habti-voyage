import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { ReservationDetailView } from "@/components/habti/views/entity-detail";

export const Route = createFileRoute("/reservations/$id")({
  head: () => ({ meta: [
    { title: "Détail réservation — Habti Voyage" },
    { name: "description", content: "Fiche complète réservation Habti Voyage." },
    { property: "og:title", content: "Détail réservation — Habti Voyage" },
    { property: "og:description", content: "Logistique, participants, statut et création opérationnelle." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  return <HabtiShell path="/reservations"><ReservationDetailView id={id} /></HabtiShell>;
}
