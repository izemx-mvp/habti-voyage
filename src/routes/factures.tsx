import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { FacturesView } from "@/components/habti/views/factures";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/factures")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Factures — Habti Voyage" },
    { name: "description", content: "Génération, envoi et archivage des factures clients de Habti Voyage." },
    { property: "og:title", content: "Factures — Habti Voyage" },
    { property: "og:description", content: "Créez vos factures depuis les devis acceptés et les réservations confirmées." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/factures"><FacturesView /></HabtiShell>,
});
