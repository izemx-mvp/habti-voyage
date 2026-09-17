import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { CampagnesView } from "@/components/habti/views/campagnes";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/campagnes/")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Campagnes — Habti Voyage" },
    { name: "description", content: "Pilotage des campagnes WhatsApp et e-mail Habti Voyage." },
    { property: "og:title", content: "Campagnes — Habti Voyage" },
    { property: "og:description", content: "Créez, lancez et suivez les campagnes commerciales Habti Voyage." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
});

function Page() {
  return <HabtiShell path="/campagnes"><CampagnesView /></HabtiShell>;
}
