import { createFileRoute } from "@tanstack/react-router";
import { HabtiShell } from "@/components/habti/shell";
import { PaiementsView } from "@/components/habti/views/paiements";
import { validateHabtiSearch } from "@/components/habti/search";

export const Route = createFileRoute("/paiements")({
  validateSearch: validateHabtiSearch,
  head: () => ({ meta: [
    { title: "Paiements — Habti Voyage" },
    { name: "description", content: "Acomptes, soldes, remboursements et encaissements en temps réel chez Habti Voyage." },
    { property: "og:title", content: "Paiements — Habti Voyage" },
    { property: "og:description", content: "Suivi des règlements clients avec calcul automatique du reste à payer." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => <HabtiShell path="/paiements"><PaiementsView /></HabtiShell>,
});
