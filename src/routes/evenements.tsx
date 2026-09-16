import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { CatalogueView } from "@/components/habti/views/catalogue";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/evenements")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Événements — Habti Voyage" },
    { name: "description", content: "Séminaires, team building et événements d'entreprise sur mesure au Maroc." },
    { property: "og:title", content: "Événements — Habti Voyage" },
    { property: "og:description", content: "Organisez des événements corporate mémorables avec Habti Voyage." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/evenements"><CatalogueView evenementsSeuls /></HabtiShell>,
});
