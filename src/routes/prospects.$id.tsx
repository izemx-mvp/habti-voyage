import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { ProspectDetailView } from "@/components/habti/views/entity-detail";

export const Route = createFileRoute("/prospects/$id")({
  head: () => ({ meta: [
    { title: "Détail prospect — Habti Voyage" },
    { name: "description", content: "Fiche complète prospect Habti Voyage." },
    { property: "og:title", content: "Détail prospect — Habti Voyage" },
    { property: "og:description", content: "Qualification, notes, actions commerciales et conversion client." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
});

function Page() {
  const { id } = Route.useParams();
  return <HabtiShell path="/prospects"><ProspectDetailView id={id} /></HabtiShell>;
}
