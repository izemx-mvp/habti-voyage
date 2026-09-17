import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { DevisView } from "@/components/habti/views/devis";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/devis/")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Devis — Habti Voyage" },
    { name: "description", content: "Construisez, envoyez et suivez les propositions commerciales de Habti Voyage." },
    { property: "og:title", content: "Devis — Habti Voyage" },
    { property: "og:description", content: "Constructeur de devis avec remises, TVA et totaux dynamiques." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/devis"><DevisView /></HabtiShell>,
});
