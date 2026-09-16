import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard" });
  },
  head: () => ({ meta: [
    { title: "Habti Voyage — Plateforme de gestion voyages & événements" },
    { name: "description", content: "Pilotez prospects, réservations, devis, paiements et opérations Habti Voyage au Maroc." },
    { property: "og:title", content: "Habti Voyage — Plateforme de gestion" },
    { property: "og:description", content: "Voyages, activités et événements d'entreprise au Maroc, gérés dans un seul espace intelligent." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});
