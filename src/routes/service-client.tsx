import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/service-client")({
  beforeLoad: () => { throw redirect({ to: "/agent-service-client" }); },
  head: () => ({ meta: [
    { title: "Redirection service client — Habti Voyage" },
    { name: "description", content: "Redirection vers l'Agent Service Client Habti Voyage." },
    { property: "og:title", content: "Agent Service Client — Habti Voyage" },
    { property: "og:description", content: "Conversations omnicanales et relais humain Habti Voyage." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});
