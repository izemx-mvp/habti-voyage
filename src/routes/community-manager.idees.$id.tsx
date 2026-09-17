import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { PostDetailView } from "@/components/habti/views/community-manager";

export const Route = createFileRoute("/community-manager/idees/$id")({
  head: () => ({ meta: [
    { title: "Détail publication — Habti Voyage" },
    { name: "description", content: "Aperçu réseau, contenu, suggestions IA et historique d'une publication HABTI." },
    { property: "og:title", content: "Détail publication — Habti Voyage" },
    { property: "og:description", content: "Aperçu, contenu, suggestions IA et validation humaine avant publication." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  return <HabtiShell path="/community-manager/idees"><PostDetailView id={id} /></HabtiShell>;
}
