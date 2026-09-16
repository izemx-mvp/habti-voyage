import { createFileRoute } from "@tanstack/react-router";
import { HabtiApp } from "@/components/habti-app";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Habti Voyage — Operations & Experience Platform" },
    { name: "description", content: "Smart commercial and operational management for Habti Voyage's travel, events and corporate experiences in Morocco." },
    { property: "og:title", content: "Habti Voyage — Operations Platform" },
    { property: "og:description", content: "Manage prospects, bookings, experiences, finance and operations from one intelligent workspace." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}), component: HabtiApp,
});
