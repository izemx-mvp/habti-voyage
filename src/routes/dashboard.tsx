import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { DashboardView } from "@/components/habti/views/dashboard";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/dashboard")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Tableau de bord — Habti Voyage" },
    { name: "description", content: "Pilotez l'activité commerciale et opérationnelle de Habti Voyage au Maroc." },
    { property: "og:title", content: "Tableau de bord — Habti Voyage" },
    { property: "og:description", content: "Réservations, prospects, encaissements et missions du jour en un coup d'œil." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/dashboard"><DashboardView /></HabtiShell>,
});
