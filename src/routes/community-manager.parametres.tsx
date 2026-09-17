import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { ParametresAgentView } from "@/components/habti/views/community-manager";

export const Route = createFileRoute("/community-manager/parametres")({
  head: () => ({ meta: [
    { title: "Paramètres de l'agent — Habti Voyage" },
    { name: "description", content: "Fréquence, ligne éditoriale, répartition et automatisation de l'agent HABTI." },
    { property: "og:title", content: "Paramètres de l'agent — Habti Voyage" },
    { property: "og:description", content: "Réglez le niveau d'automatisation et la ligne éditoriale de l'agent." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/community-manager/parametres"><ParametresAgentView /></HabtiShell>,
});
