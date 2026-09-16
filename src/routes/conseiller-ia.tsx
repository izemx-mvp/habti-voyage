import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { ConseillerIAView } from "@/components/habti/views/conseiller-ia";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/conseiller-ia")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Conseiller Voyage & Activités IA — Habti Voyage" },
    { name: "description", content: "Recommandations d'expériences marocaines selon la ville, le budget et le mood du client." },
    { property: "og:title", content: "Conseiller Voyage & Activités IA — Habti Voyage" },
    { property: "og:description", content: "Suggestions personnalisées avec score de correspondance et passage direct au devis." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/conseiller-ia"><ConseillerIAView /></HabtiShell>,
});
