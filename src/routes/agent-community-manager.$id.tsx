import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { SocialPostDetailView } from "@/components/habti/views/entity-detail";

export const Route = createFileRoute("/agent-community-manager/$id")({
  head: () => ({ meta: [
    { title: "Détail publication — Habti Voyage" },
    { name: "description", content: "Fiche complète de publication sociale Habti Voyage." },
    { property: "og:title", content: "Détail publication — Habti Voyage" },
    { property: "og:description", content: "Aperçu, légende, hashtags et validation humaine avant publication." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  return <HabtiShell path="/agent-community-manager"><SocialPostDetailView id={id} /></HabtiShell>;
}
