import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { ClientsView } from "@/components/habti/views/clients";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/clients")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Clients — Habti Voyage" },
    { name: "description", content: "Portefeuille clients, historique de voyages et valeur générée chez Habti Voyage." },
    { property: "og:title", content: "Clients — Habti Voyage" },
    { property: "og:description", content: "Fiches clients, réservations et chiffre d'affaires par compte." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/clients"><ClientsView /></HabtiShell>,
});
