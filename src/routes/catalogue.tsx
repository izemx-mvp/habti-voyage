import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { CatalogueView } from "@/components/habti/views/catalogue";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/catalogue")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Catalogue — Habti Voyage" },
    { name: "description", content: "Activités, voyages, événements et packages proposés par Habti Voyage au Maroc." },
    { property: "og:title", content: "Catalogue — Habti Voyage" },
    { property: "og:description", content: "Gérez vos prestations : prix, durée, capacité, disponibilité et statut." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/catalogue"><CatalogueView /></HabtiShell>,
});
