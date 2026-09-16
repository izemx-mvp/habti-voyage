import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { RapportsView } from "@/components/habti/views/rapports";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/rapports")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Rapports & analyses — Habti Voyage" },
    { name: "description", content: "Performance commerciale et opérationnelle de l'agence Habti Voyage au Maroc." },
    { property: "og:title", content: "Rapports & analyses — Habti Voyage" },
    { property: "og:description", content: "Chiffre d'affaires, conversion, destinations et panier moyen." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/rapports"><RapportsView /></HabtiShell>,
});
