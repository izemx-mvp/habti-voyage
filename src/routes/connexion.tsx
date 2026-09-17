import { createFileRoute } from "@tanstack/react-router";
import { LoginView } from "@/components/habti/views/login";

export const Route = createFileRoute("/connexion")({
  head: () => ({ meta: [
    { title: "Connexion — Habti Voyage" },
    { name: "description", content: "Connexion à la plateforme opérationnelle Habti Voyage." },
    { property: "og:title", content: "Connexion — Habti Voyage" },
    { property: "og:description", content: "Accédez à l’espace HABTI de démonstration premium." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
});

function Page() {
  return <LoginView />;
}
