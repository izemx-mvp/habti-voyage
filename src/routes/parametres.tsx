import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { ParametresView } from "@/components/habti/views/parametres";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/parametres")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Paramètres — Habti Voyage" },
    { name: "description", content: "Informations d’agence, équipe, documents et règles métier Habti Voyage." },
    { property: "og:title", content: "Paramètres — Habti Voyage" },
    { property: "og:description", content: "Configurez les informations d’entreprise, l’équipe et les notifications." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/parametres"><ParametresView /></HabtiShell>,
});
