import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { ReservationsView } from "@/components/habti/views/reservations";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/reservations/")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Réservations — Habti Voyage" },
    { name: "description", content: "Suivi complet des réservations Habti Voyage, de la demande à la réalisation." },
    { property: "og:title", content: "Réservations — Habti Voyage" },
    { property: "og:description", content: "Création, confirmation, affectation et suivi des réservations au Maroc." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/reservations"><ReservationsView /></HabtiShell>,
});
