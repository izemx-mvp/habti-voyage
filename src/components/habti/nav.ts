import {
  BarChart3, Bot, BriefcaseBusiness, CalendarDays, CalendarRange, CreditCard, FileText,
  Headphones, LayoutDashboard, MapPin, PartyPopper, ReceiptText, Settings2, Target, Users, UsersRound, WandSparkles,
} from "lucide-react";

export type NavItem = { path: string; label: string; icon: typeof Target };

export const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "PILOTAGE",
    items: [
      { path: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
      { path: "/prospects", label: "Prospects", icon: Target },
      { path: "/clients", label: "Clients", icon: Users },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { path: "/agent-prospection", label: "Agent de prospection IA", icon: Bot },
      { path: "/conseiller-ia", label: "Conseiller IA", icon: WandSparkles },
    ],
  },
  {
    label: "OPÉRATIONS",
    items: [
      { path: "/reservations", label: "Réservations", icon: CalendarDays },
      { path: "/planning", label: "Planning", icon: CalendarRange },
      { path: "/catalogue", label: "Catalogue", icon: MapPin },
      { path: "/evenements", label: "Événements", icon: PartyPopper },
      { path: "/missions", label: "Missions", icon: BriefcaseBusiness },
      { path: "/employes", label: "Employés", icon: UsersRound },
    ],
  },
  {
    label: "COMMERCE",
    items: [
      { path: "/devis", label: "Devis", icon: FileText },
      { path: "/paiements", label: "Paiements", icon: CreditCard },
      { path: "/factures", label: "Factures", icon: ReceiptText },
      { path: "/service-client", label: "Service client", icon: Headphones },
    ],
  },
  {
    label: "ANALYSE",
    items: [
      { path: "/rapports", label: "Rapports", icon: BarChart3 },
      { path: "/parametres", label: "Paramètres", icon: Settings2 },
    ],
  },
];

export const pageMeta: Record<string, { titre: string; sous: string }> = {
  "/dashboard": { titre: "Bonjour Salma", sous: "Voici ce qui mérite votre attention aujourd'hui au Maroc." },
  "/prospects": { titre: "Prospects", sous: "Qualification, scoring et suivi commercial de vos opportunités." },
  "/clients": { titre: "Clients", sous: "Portefeuille clients, historique et valeur générée." },
  "/agent-prospection": { titre: "Agent de prospection IA", sous: "Captez, qualifiez et enrichissez vos demandes en conversation." },
  "/conseiller-ia": { titre: "Conseiller Voyage & Activités IA", sous: "Recommandations personnalisées selon le mood, la ville et le budget." },
  "/reservations": { titre: "Réservations", sous: "Cycle complet de la demande à la réalisation." },
  "/planning": { titre: "Planning", sous: "Vue jour, semaine et mois des activités et affectations." },
  "/catalogue": { titre: "Catalogue", sous: "Activités, voyages, événements et packages Habti." },
  "/evenements": { titre: "Événements", sous: "Séminaires, team building et événements sur mesure." },
  "/devis": { titre: "Devis", sous: "Construisez, envoyez et suivez vos propositions commerciales." },
  "/paiements": { titre: "Paiements", sous: "Acomptes, soldes et encaissements en temps réel." },
  "/factures": { titre: "Factures", sous: "Génération, envoi et archivage de vos factures." },
  "/service-client": { titre: "Service client", sous: "Conversations omnicanales assistées par l'IA." },
  "/missions": { titre: "Missions & opérations", sous: "Affectations terrain, checklists et suivi logistique." },
  "/employes": { titre: "Employés & planning", sous: "Équipe, disponibilités, compétences et charge de travail." },
  "/rapports": { titre: "Rapports & analyses", sous: "Performance commerciale et opérationnelle de l'agence." },
  "/parametres": { titre: "Paramètres & configuration IA", sous: "Agence, équipe, documents et comportement des agents IA." },
};
