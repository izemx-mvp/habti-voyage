import { createFileRoute } from "@tanstack/react-router";
import { HabtiApp } from "@/components/habti-app";
export const Route = createFileRoute("/ai/$threadId")({
  head: () => ({ meta: [
    { title: "AI Conversation — Habti Voyage" },
    { name: "description", content: "A dedicated Habti Voyage AI conversation for prospect qualification and experience planning." },
    { property: "og:title", content: "AI Conversation — Habti Voyage" },
    { property: "og:description", content: "Qualify demand and curate Moroccan travel experiences with Habti AI." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}), component: () => <HabtiApp initialView="ai-agent" />,
});
