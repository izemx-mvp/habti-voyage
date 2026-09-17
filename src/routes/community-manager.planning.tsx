import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { PlanningEditorialView } from "@/components/habti/views/community-manager";

export const Route = createFileRoute("/community-manager/planning")({
  head: () => ({ meta: [
    { title: "Planning éditorial — Habti Voyage" },
    { name: "description", content: "Calendrier interactif des publications HABTI sur Facebook, Instagram et TikTok." },
    { property: "og:title", content: "Planning éditorial — Habti Voyage" },
    { property: "og:description", content: "Organisez, déplacez et planifiez les contenus sociaux HABTI." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/community-manager/planning"><PlanningEditorialView /></HabtiShell>,
});
