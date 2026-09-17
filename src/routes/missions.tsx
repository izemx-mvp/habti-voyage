import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/missions")({
  beforeLoad: () => { throw redirect({ to: "/operations" }); },
  head: () => ({ meta: [
    { title: "Redirection opérations — Habti Voyage" },
    { name: "description", content: "Redirection vers le command center opérations Habti Voyage." },
    { property: "og:title", content: "Opérations — Habti Voyage" },
    { property: "og:description", content: "Checklists, équipes et validations terrain Habti Voyage." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});
