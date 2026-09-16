import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { ParametresView } from "@/components/habti/views/parametres";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/parametres")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Paramètres & configuration IA — Habti Voyage" },
    { name: "description", content: "Informations d'agence, équipe, documents et comportement des agents IA Habti Voyage." },
    { property: "og:title", content: "Paramètres & configuration IA — Habti Voyage" },
    { property: "og:description", content: "Personnalisez la tonalité, la langue et les règles de qualification de l'IA." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/parametres"><ParametresView /></HabtiShell>,
});
