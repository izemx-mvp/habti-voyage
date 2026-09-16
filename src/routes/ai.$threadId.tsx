import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ai/$threadId")({
  beforeLoad: () => {
    throw redirect({ to: "/agent-prospection" });
  },
  head: () => ({ meta: [
    { title: "Conversation IA — Habti Voyage" },
    { name: "description", content: "Conversation dédiée avec l'assistant IA de Habti Voyage." },
    { property: "og:title", content: "Conversation IA — Habti Voyage" },
    { property: "og:description", content: "Qualification de la demande et recommandations d'expériences marocaines." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});
