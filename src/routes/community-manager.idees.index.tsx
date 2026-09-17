import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { IdeesView } from "@/components/habti/views/community-manager";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/community-manager/idees/")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Idées de contenu — Habti Voyage" },
    { name: "description", content: "Créez, générez et validez les contenus sociaux HABTI." },
    { property: "og:title", content: "Idées de contenu — Habti Voyage" },
    { property: "og:description", content: "Génération IA, validation humaine et publication des contenus HABTI." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/community-manager/idees"><IdeesView /></HabtiShell>,
});
