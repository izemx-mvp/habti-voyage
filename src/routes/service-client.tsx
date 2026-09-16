import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { ServiceClientView } from "@/components/habti/views/service-client";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/service-client")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Service client — Habti Voyage" },
    { name: "description", content: "Conversations omnicanales assistées par l'IA pour les voyageurs Habti Voyage." },
    { property: "og:title", content: "Service client — Habti Voyage" },
    { property: "og:description", content: "Répondez plus vite avec le contexte client complet et les réponses IA." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/service-client"><ServiceClientView /></HabtiShell>,
});
