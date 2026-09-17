import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { ParametresCompteView } from "@/components/habti/views/parametres-compte";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/parametres-compte")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Paramètres du compte — Habti Voyage" },
    { name: "description", content: "Profil, sécurité et notifications personnelles Habti Voyage." },
    { property: "og:title", content: "Paramètres du compte — Habti Voyage" },
    { property: "og:description", content: "Réglez votre profil, la sécurité et les alertes personnelles." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
});

function Page() {
  return <HabtiShell path="/parametres-compte"><ParametresCompteView /></HabtiShell>;
}
