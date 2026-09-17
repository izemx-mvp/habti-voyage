import {
  BarChart3, Bot, BriefcaseBusiness, CalendarDays, CalendarRange, CreditCard, FileText,
  Headphones, LayoutDashboard, MapPin, Megaphone, ReceiptText, Settings2, Sparkles, Target, UserCog, Users, UsersRound,
} from "lucide-react";

export type NavItem = { path: string; label: string; icon: typeof Target };

export const navGroups: { label: string; items: NavItem[] }[] = [
  { label: "PILOTAGE", items: [{ path: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard }] },
  {
    label: "COMMERCIAL",
    items: [
      { path: "/prospects", label: "Prospects", icon: Target },
      { path: "/clients", label: "Clients", icon: Users },
      { path: "/campagnes", label: "Campagnes", icon: Megaphone },
      { path: "/reservations", label: "Réservations", icon: CalendarDays },
      { path: "/devis", label: "Devis", icon: FileText },
    ],
  },
  {
    label: "EXPÉRIENCE CLIENT",
    items: [
      { path: "/agent-service-client", label: "Agent Service Client", icon: Headphones },
      { path: "/conseiller-ia", label: "Conseiller Voyage & Activités", icon: Bot },
    ],
  },
  { label: "MARKETING", items: [{ path: "/agent-community-manager", label: "Agent Community Manager", icon: Sparkles }] },
  {
    label: "OPÉRATIONS",
    items: [
      { path: "/planning", label: "Planning", icon: CalendarRange },
      { path: "/operations", label: "Opérations", icon: BriefcaseBusiness },
      { path: "/catalogue", label: "Catalogue", icon: MapPin },
      { path: "/employes", label: "Employés", icon: UsersRound },
    ],
  },
  { label: "FINANCE", items: [{ path: "/paiements", label: "Paiements", icon: CreditCard }, { path: "/factures", label: "Factures", icon: ReceiptText }] },
  { label: "ANALYSE", items: [{ path: "/rapports", label: "Rapports", icon: BarChart3 }] },
  { label: "SYSTÈME", items: [{ path: "/parametres", label: "Paramètres", icon: Settings2 }, { path: "/parametres-compte", label: "Paramètres du compte", icon: UserCog }] },
];

export const pageMeta: Record<string, { titre: string; sous: string }> = {
  "/dashboard": { titre: "Bonjour Salma", sous: "Votre centre de pilotage HABTI pour aujourd'hui." },
  "/prospects": { titre: "Prospects", sous: "Qualification, scoring et suivi commercial de vos opportunités." },
  "/clients": { titre: "Clients", sous: "Portefeuille clients, historique et valeur générée." },
  "/campagnes": { titre: "Campagnes", sous: "WhatsApp, e-mail et historique des activations commerciales." },
  "/reservations": { titre: "Réservations", sous: "Cycle complet de la demande à la réalisation." },
  "/devis": { titre: "Devis", sous: "Construisez, envoyez et suivez vos propositions commerciales." },
  "/agent-service-client": { titre: "Agent Service Client", sous: "Conversations omnicanales, FAQ, connaissance et prise de relais humain." },
  "/conseiller-ia": { titre: "Conseiller Voyage & Activités", sous: "Recommandations personnalisées selon ville, mood, budget et profil client." },
  "/agent-community-manager": { titre: "Agent Community Manager", sous: "Idées, planning éditorial et réglages de publication en mode démonstration." },
  "/planning": { titre: "Planning", sous: "Vue jour, semaine et mois des activités et affectations." },
  "/operations": { titre: "Opérations", sous: "Command center terrain, checklists, équipe et analyse IA." },
  "/missions": { titre: "Opérations", sous: "Command center terrain, checklists, équipe et analyse IA." },
  "/catalogue": { titre: "Catalogue", sous: "Activités, voyages, événements et packages HABTI." },
  "/employes": { titre: "Employés", sous: "Équipe, disponibilités, compétences et charge de travail." },
  "/paiements": { titre: "Paiements", sous: "Acomptes, soldes et encaissements en temps réel." },
  "/factures": { titre: "Factures", sous: "Génération, envoi et archivage de vos factures." },
  "/rapports": { titre: "Rapports", sous: "Performance commerciale, opérationnelle et marketing." },
  "/parametres": { titre: "Paramètres", sous: "Entreprise, utilisateurs, rôles, documents et règles métier." },
  "/parametres-compte": { titre: "Paramètres du compte", sous: "Profil, sécurité, notifications et préférences personnelles." },
};
