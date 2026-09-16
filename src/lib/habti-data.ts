import sahara from "@/assets/sahara-luxury.jpg";
import riad from "@/assets/marrakech-riad.jpg";
import atlas from "@/assets/atlas-expedition.jpg";

export const VILLES = ["Marrakech", "Casablanca", "Rabat", "Agadir", "Essaouira", "Fès", "Tanger", "Ouarzazate", "Merzouga"] as const;
export const MOODS = ["Aventure", "Détente", "Romantique", "Famille", "Culture", "Gastronomie", "Luxe", "Nature", "Sport", "Team Building", "Découverte"] as const;
export const SOURCES = ["Site web", "Instagram", "Recommandation", "LinkedIn", "Téléphone", "Agence partenaire", "Salon professionnel"] as const;
export const TYPES_DEMANDE = ["Activité", "Voyage", "Événement", "Séminaire d'entreprise", "Team building", "Voyage de noces"] as const;

export const STATUTS_PROSPECT = ["Nouveau", "À qualifier", "Qualifié", "Proposition à préparer", "Devis envoyé", "En attente", "Réservation confirmée", "Client", "Perdu"] as const;
export const STATUTS_RESERVATION = ["Demande reçue", "Suggestion envoyée", "En attente", "Réservée", "Confirmée", "En cours", "Terminée", "Annulée"] as const;
export const STATUTS_DEVIS = ["Brouillon", "À valider", "Envoyé", "En attente", "Accepté", "Refusé", "Expiré"] as const;
export const STATUTS_PAIEMENT = ["Non payé", "Acompte reçu", "Partiellement payé", "Payé", "En retard", "Remboursé"] as const;
export const STATUTS_MISSION = ["À planifier", "Planifiée", "Affectée", "Confirmée", "En cours", "Terminée", "Annulée"] as const;
export const STATUTS_TICKET = ["Nouveau", "Pris en charge par l'IA", "En attente", "Transféré à un conseiller", "En cours", "Résolu", "Fermé"] as const;

export const TYPES_PAIEMENT = ["Acompte", "Paiement partiel", "Solde", "Remboursement"] as const;
export const MODES_PAIEMENT = ["Carte bancaire", "Espèces", "Virement bancaire", "Chèque", "Paiement en ligne"] as const;
export const CATEGORIES_PRESTATION = ["Activité", "Voyage", "Événement", "Package"] as const;

export type StatutProspect = (typeof STATUTS_PROSPECT)[number];
export type StatutReservation = (typeof STATUTS_RESERVATION)[number];
export type StatutDevis = (typeof STATUTS_DEVIS)[number];
export type StatutPaiement = (typeof STATUTS_PAIEMENT)[number];
export type StatutMission = (typeof STATUTS_MISSION)[number];
export type StatutTicket = (typeof STATUTS_TICKET)[number];

export type Note = { id: string; texte: string; date: string; auteur: string };

export type Prospect = {
  id: string; prenom: string; nom: string; telephone: string; email: string; ville: string;
  source: string; typeDemande: string; dateSouhaitee: string; personnes: number; budget: number;
  mood: string; activites: string; notes: Note[]; statut: StatutProspect; score: number;
  conseiller: string; createdAt: string; historique: { texte: string; date: string }[];
};

export type Client = {
  id: string; nom: string; ville: string; email: string; telephone: string;
  segment: string; reservations: number; chiffreAffaires: number; depuis: string;
};

export type Reservation = {
  id: string; reference: string; client: string; prestation: string; ville: string; date: string;
  heure: string; participants: number; tarif: number; employe: string; notes: string; statut: StatutReservation;
};

export type LigneDevis = { id: string; designation: string; quantite: number; prixUnitaire: number };

export type Devis = {
  id: string; reference: string; client: string; lignes: LigneDevis[]; remise: number; tva: number;
  statut: StatutDevis; date: string; validite: string;
};

export type Paiement = {
  id: string; reference: string; client: string; rattachement: string; montantTotal: number;
  montantPaye: number; type: string; mode: string; date: string; note: string; statut: StatutPaiement;
};

export type Facture = {
  id: string; reference: string; client: string; montant: number; date: string;
  echeance: string; statut: StatutPaiement; origine: string;
};

export type Mission = {
  id: string; titre: string; client: string; activite: string; date: string; heure: string; lieu: string;
  employes: string[]; statut: StatutMission; checklist: { id: string; label: string; fait: boolean }[]; notes: Note[];
};

export type Employe = {
  id: string; nom: string; role: string; ville: string; specialites: string[];
  disponibilite: "Disponible" | "En mission" | "Congé"; missions: number; charge: number; initiales: string;
};

export type Prestation = {
  id: string; nom: string; ville: string; categorie: string; prix: number; duree: string; capacite: number;
  disponibilite: string; statut: "Active" | "Désactivée"; image: string; moods: string[]; description: string; score: number;
};

export type TicketMessage = { id: string; auteur: "client" | "habti" | "ia"; texte: string; heure: string };

export type Ticket = {
  id: string; client: string; canal: string; sujet: string; statut: StatutTicket;
  messages: TicketMessage[]; resume: string; reservation: string; paiement: string;
};

const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 9)}`;
export const newId = uid;

export const prospectsSeed: Prospect[] = [
  { id: "P-1001", prenom: "Sofia", nom: "Martinez", telephone: "+34 611 204 118", email: "sofia.martinez@mail.es", ville: "Merzouga", source: "Instagram", typeDemande: "Voyage", dateSouhaitee: "2026-10-12", personnes: 4, budget: 8400, mood: "Luxe", activites: "Excursion désert, Dîner spectacle", notes: [{ id: uid("n"), texte: "Souhaite un campement privé avec accueil musical.", date: "16/09/2026", auteur: "Salma Bennani" }], statut: "Qualifié", score: 92, conseiller: "Salma Bennani", createdAt: "2026-09-16", historique: [{ texte: "Demande reçue via Instagram", date: "16/09/2026 11:24" }, { texte: "Qualification IA terminée", date: "16/09/2026 11:36" }] },
  { id: "P-1002", prenom: "Amine", nom: "El Idrissi", telephone: "+212 661 442 097", email: "a.elidrissi@atlascreative.ma", ville: "Marrakech", source: "Recommandation", typeDemande: "Team building", dateSouhaitee: "2026-10-05", personnes: 28, budget: 12000, mood: "Team Building", activites: "Quad, Team Building Agafay", notes: [], statut: "Devis envoyé", score: 86, conseiller: "Karim Naji", createdAt: "2026-09-12", historique: [{ texte: "Devis DV-2026-183 envoyé", date: "14/09/2026 16:05" }] },
  { id: "P-1003", prenom: "Charlotte", nom: "Moreau", telephone: "+33 6 12 55 88 04", email: "charlotte.moreau@mail.fr", ville: "Fès", source: "Site web", typeDemande: "Voyage", dateSouhaitee: "2026-11-02", personnes: 2, budget: 6200, mood: "Culture", activites: "Circuit culturel, Visite guidée", notes: [], statut: "À qualifier", score: 78, conseiller: "Salma Bennani", createdAt: "2026-09-15", historique: [{ texte: "Formulaire site web complété", date: "15/09/2026 09:12" }] },
  { id: "P-1004", prenom: "Oliver", nom: "Bennett", telephone: "+44 7700 900 231", email: "o.bennett@mail.co.uk", ville: "Ouarzazate", source: "LinkedIn", typeDemande: "Activité", dateSouhaitee: "2026-10-22", personnes: 6, budget: 4800, mood: "Aventure", activites: "Excursion montagne, Montgolfière", notes: [], statut: "Nouveau", score: 69, conseiller: "Non affecté", createdAt: "2026-09-16", historique: [{ texte: "Nouveau contact LinkedIn", date: "16/09/2026 08:40" }] },
  { id: "P-1005", prenom: "Nadia", nom: "Berrada", telephone: "+212 662 118 774", email: "nadia.berrada@groupe-nb.ma", ville: "Casablanca", source: "Salon professionnel", typeDemande: "Séminaire d'entreprise", dateSouhaitee: "2026-12-04", personnes: 45, budget: 26000, mood: "Gastronomie", activites: "Dîner spectacle, Hammam & Spa", notes: [], statut: "Proposition à préparer", score: 81, conseiller: "Karim Naji", createdAt: "2026-09-10", historique: [{ texte: "Rencontre au salon de Casablanca", date: "10/09/2026 14:00" }] },
  { id: "P-1006", prenom: "Youssef", nom: "Hamdaoui", telephone: "+212 670 552 310", email: "y.hamdaoui@mail.ma", ville: "Agadir", source: "Téléphone", typeDemande: "Activité", dateSouhaitee: "2026-09-28", personnes: 8, budget: 3200, mood: "Sport", activites: "Surf, Quad", notes: [], statut: "En attente", score: 64, conseiller: "Imane Tazi", createdAt: "2026-09-09", historique: [{ texte: "Relance téléphonique effectuée", date: "13/09/2026 10:15" }] },
];

export const clientsSeed: Client[] = [
  { id: "C-201", nom: "Northstar & Co.", ville: "Casablanca", email: "events@northstar.ma", telephone: "+212 522 447 118", segment: "Entreprise", reservations: 12, chiffreAffaires: 96400, depuis: "2021" },
  { id: "C-202", nom: "Atelier Noor", ville: "Marrakech", email: "contact@ateliernoor.ma", telephone: "+212 524 336 002", segment: "Entreprise", reservations: 7, chiffreAffaires: 41250, depuis: "2023" },
  { id: "C-203", nom: "Famille Lemaire", ville: "Essaouira", email: "lemaire.famille@mail.fr", telephone: "+33 6 88 04 55 21", segment: "Particulier", reservations: 4, chiffreAffaires: 18600, depuis: "2024" },
  { id: "C-204", nom: "Sahara Luxe Travel", ville: "Merzouga", email: "booking@saharaluxe.com", telephone: "+212 668 224 901", segment: "Agence partenaire", reservations: 19, chiffreAffaires: 132700, depuis: "2019" },
];

export const reservationsSeed: Reservation[] = [
  { id: "R-501", reference: "RES-2026-501", client: "Northstar & Co.", prestation: "Team Building Agafay", ville: "Marrakech", date: "2026-09-16", heure: "14:00", participants: 28, tarif: 11200, employe: "Karim Naji", notes: "Prévoir tentes berbères et sonorisation.", statut: "Confirmée" },
  { id: "R-502", reference: "RES-2026-502", client: "Sofia Martinez", prestation: "Excursion désert Merzouga", ville: "Merzouga", date: "2026-10-12", heure: "09:00", participants: 4, tarif: 8400, employe: "Youssef Amrani", notes: "Campement privé, accueil musical.", statut: "Réservée" },
  { id: "R-503", reference: "RES-2026-503", client: "Atelier Noor", prestation: "Dîner spectacle Marrakech", ville: "Marrakech", date: "2026-09-16", heure: "19:30", participants: 16, tarif: 3450, employe: "Imane Tazi", notes: "Menu sans gluten pour 3 invités.", statut: "En cours" },
  { id: "R-504", reference: "RES-2026-504", client: "Famille Lemaire", prestation: "Surf & Hammam Essaouira", ville: "Essaouira", date: "2026-09-18", heure: "10:00", participants: 5, tarif: 1850, employe: "Hafsa Idrissi", notes: "Deux enfants débutants.", statut: "En attente" },
  { id: "R-505", reference: "RES-2026-505", client: "Sahara Luxe Travel", prestation: "Montgolfière Marrakech", ville: "Marrakech", date: "2026-09-20", heure: "06:30", participants: 10, tarif: 2600, employe: "Youssef Amrani", notes: "Transfert hôtel inclus.", statut: "Demande reçue" },
];

export const devisSeed: Devis[] = [
  { id: "D-183", reference: "DV-2026-183", client: "Atlas Creative", lignes: [{ id: uid("l"), designation: "Team building Agafay (journée)", quantite: 28, prixUnitaire: 320 }, { id: uid("l"), designation: "Transferts privés", quantite: 2, prixUnitaire: 600 }], remise: 5, tva: 20, statut: "Envoyé", date: "2026-09-14", validite: "2026-09-30" },
  { id: "D-184", reference: "DV-2026-184", client: "Sofia Martinez", lignes: [{ id: uid("l"), designation: "Campement privé Merzouga (3 nuits)", quantite: 4, prixUnitaire: 1450 }, { id: uid("l"), designation: "Dîner spectacle privatisé", quantite: 1, prixUnitaire: 1200 }], remise: 0, tva: 20, statut: "À valider", date: "2026-09-16", validite: "2026-10-02" },
  { id: "D-185", reference: "DV-2026-185", client: "Oliver Bennett", lignes: [{ id: uid("l"), designation: "Excursion montagne Atlas", quantite: 6, prixUnitaire: 240 }], remise: 0, tva: 20, statut: "Brouillon", date: "2026-09-16", validite: "2026-10-10" },
];

export const paiementsSeed: Paiement[] = [
  { id: "PA-8921", reference: "PAY-2026-8921", client: "Northstar & Co.", rattachement: "RES-2026-501", montantTotal: 11200, montantPaye: 5600, type: "Acompte", mode: "Virement bancaire", date: "2026-09-10", note: "Acompte 50 % reçu.", statut: "Acompte reçu" },
  { id: "PA-8918", reference: "PAY-2026-8918", client: "Sofia Martinez", rattachement: "DV-2026-184", montantTotal: 8400, montantPaye: 2800, type: "Paiement partiel", mode: "Carte bancaire", date: "2026-09-15", note: "", statut: "Partiellement payé" },
  { id: "PA-8912", reference: "PAY-2026-8912", client: "Sahara Luxe Travel", rattachement: "RES-2026-505", montantTotal: 2600, montantPaye: 2600, type: "Solde", mode: "Paiement en ligne", date: "2026-09-08", note: "", statut: "Payé" },
  { id: "PA-8907", reference: "PAY-2026-8907", client: "Atelier Noor", rattachement: "RES-2026-503", montantTotal: 3450, montantPaye: 0, type: "Solde", mode: "Chèque", date: "2026-08-30", note: "Relance envoyée.", statut: "En retard" },
];

export const facturesSeed: Facture[] = [
  { id: "F-092", reference: "FA-2026-092", client: "Sahara Luxe Travel", montant: 2600, date: "2026-09-08", echeance: "2026-09-22", statut: "Payé", origine: "RES-2026-505" },
  { id: "F-091", reference: "FA-2026-091", client: "Atelier Noor", montant: 3450, date: "2026-08-30", echeance: "2026-09-13", statut: "En retard", origine: "RES-2026-503" },
  { id: "F-090", reference: "FA-2026-090", client: "Northstar & Co.", montant: 11200, date: "2026-09-10", echeance: "2026-09-24", statut: "Acompte reçu", origine: "RES-2026-501" },
];

export const missionsSeed: Mission[] = [
  { id: "M-301", titre: "Installation campement Agafay", client: "Northstar & Co.", activite: "Team Building Agafay", date: "2026-09-16", heure: "14:00", lieu: "Désert d'Agafay, Marrakech", employes: ["Karim Naji", "Youssef Amrani"], statut: "En cours", checklist: [{ id: uid("c"), label: "Vérifier les régimes alimentaires", fait: true }, { id: uid("c"), label: "Affecter un chauffeur de secours", fait: true }, { id: uid("c"), label: "Valider le montage du campement", fait: false }, { id: uid("c"), label: "Envoyer le brief invités", fait: false }], notes: [] },
  { id: "M-302", titre: "Accueil arrivée riad", client: "Atelier Noor", activite: "Dîner spectacle Marrakech", date: "2026-09-16", heure: "19:00", lieu: "Médina, Marrakech", employes: ["Imane Tazi"], statut: "Affectée", checklist: [{ id: uid("c"), label: "Confirmer la table privatisée", fait: true }, { id: uid("c"), label: "Préparer les menus sans gluten", fait: false }], notes: [] },
  { id: "M-303", titre: "Préparation excursion désert", client: "Sofia Martinez", activite: "Excursion désert Merzouga", date: "2026-10-12", heure: "09:00", lieu: "Merzouga", employes: [], statut: "À planifier", checklist: [{ id: uid("c"), label: "Réserver les 4x4", fait: false }, { id: uid("c"), label: "Confirmer le guide local", fait: false }], notes: [] },
];

export const employesSeed: Employe[] = [
  { id: "E-11", nom: "Karim Naji", role: "Chef de projet événementiel", ville: "Marrakech", specialites: ["Team building", "Séminaires"], disponibilite: "En mission", missions: 6, charge: 82, initiales: "KN" },
  { id: "E-12", nom: "Youssef Amrani", role: "Guide désert senior", ville: "Merzouga", specialites: ["Désert", "4x4", "Bivouac"], disponibilite: "Disponible", missions: 4, charge: 58, initiales: "YA" },
  { id: "E-13", nom: "Imane Tazi", role: "Conseillère voyages", ville: "Marrakech", specialites: ["Culture", "Gastronomie"], disponibilite: "Disponible", missions: 5, charge: 64, initiales: "IT" },
  { id: "E-14", nom: "Hafsa Idrissi", role: "Coordinatrice activités", ville: "Essaouira", specialites: ["Surf", "Bien-être"], disponibilite: "Congé", missions: 2, charge: 20, initiales: "HI" },
  { id: "E-15", nom: "Salma Bennani", role: "Directrice commerciale", ville: "Casablanca", specialites: ["Grands comptes", "Négociation"], disponibilite: "Disponible", missions: 3, charge: 71, initiales: "SB" },
];

export const prestationsSeed: Prestation[] = [
  { id: "A-01", nom: "Nuit privée sous les étoiles", ville: "Merzouga", categorie: "Voyage", prix: 690, duree: "3 jours", capacite: 12, disponibilite: "Disponible", statut: "Active", image: sahara, moods: ["Luxe", "Découverte", "Romantique"], description: "Campement privatisé dans les dunes, dîner berbère et lever de soleil à dos de dromadaire.", score: 98 },
  { id: "A-02", nom: "Collection riads de la Médina", ville: "Marrakech", categorie: "Package", prix: 320, duree: "2 nuits", capacite: 20, disponibilite: "Dernières places", statut: "Active", image: riad, moods: ["Culture", "Détente", "Luxe"], description: "Séjour raffiné dans nos riads partenaires avec hammam, visite guidée et dîner spectacle.", score: 96 },
  { id: "A-03", nom: "Ascension Atlas & vallées", ville: "Ouarzazate", categorie: "Activité", prix: 240, duree: "Journée", capacite: 16, disponibilite: "Disponible", statut: "Active", image: atlas, moods: ["Aventure", "Nature", "Sport"], description: "Randonnée encadrée dans le Haut Atlas, déjeuner chez l'habitant et sources naturelles.", score: 91 },
  { id: "A-04", nom: "Team Building Agafay", ville: "Marrakech", categorie: "Événement", prix: 320, duree: "Journée", capacite: 60, disponibilite: "Disponible", statut: "Active", image: sahara, moods: ["Team Building", "Aventure"], description: "Olympiades dans le désert d'Agafay, quad, tir à l'arc et dîner sous tente caïdale.", score: 94 },
  { id: "A-05", nom: "Surf & Hammam Essaouira", ville: "Essaouira", categorie: "Activité", prix: 180, duree: "Demi-journée", capacite: 14, disponibilite: "Disponible", statut: "Active", image: atlas, moods: ["Sport", "Détente", "Famille"], description: "Initiation surf avec moniteurs diplômés suivie d'un hammam traditionnel.", score: 88 },
  { id: "A-06", nom: "Montgolfière au lever du jour", ville: "Marrakech", categorie: "Activité", prix: 260, duree: "3 heures", capacite: 10, disponibilite: "Complet", statut: "Active", image: riad, moods: ["Romantique", "Découverte"], description: "Vol en montgolfière au-dessus de la palmeraie, petit-déjeuner berbère inclus.", score: 93 },
];

export const ticketsSeed: Ticket[] = [
  { id: "T-77", client: "Sofia Martinez", canal: "WhatsApp", sujet: "Modification de la date d'excursion", statut: "Pris en charge par l'IA", reservation: "RES-2026-502", paiement: "Partiellement payé", resume: "La cliente souhaite décaler son excursion désert du 12 au 14 octobre. Disponibilité à confirmer avec le guide.", messages: [{ id: uid("m"), auteur: "client", texte: "Bonjour, serait-il possible de décaler notre excursion au 14 octobre ?", heure: "09:12" }, { id: uid("m"), auteur: "ia", texte: "Bonjour Sofia, je vérifie la disponibilité du campement pour le 14 octobre et je reviens vers vous dans quelques minutes.", heure: "09:13" }] },
  { id: "T-78", client: "Atelier Noor", canal: "E-mail", sujet: "Facture FA-2026-091 en retard", statut: "Transféré à un conseiller", reservation: "RES-2026-503", paiement: "En retard", resume: "Le client demande un échéancier pour régler la facture en retard.", messages: [{ id: uid("m"), auteur: "client", texte: "Pouvons-nous convenir d'un paiement en deux fois pour la facture de septembre ?", heure: "11:40" }] },
  { id: "T-79", client: "Famille Lemaire", canal: "Téléphone", sujet: "Matériel surf pour enfants", statut: "Nouveau", reservation: "RES-2026-504", paiement: "Non payé", resume: "Demande de combinaisons taille enfant pour deux participants.", messages: [{ id: uid("m"), auteur: "client", texte: "Avez-vous des combinaisons pour enfants de 8 et 10 ans ?", heure: "16:05" }] },
];

export const perfChart = [
  { m: "Jan", v: 32 }, { m: "Fév", v: 41 }, { m: "Mar", v: 38 }, { m: "Avr", v: 54 },
  { m: "Mai", v: 62 }, { m: "Juin", v: 58 }, { m: "Juil", v: 76 }, { m: "Août", v: 81 }, { m: "Sep", v: 88 },
];

export const euro = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);

export const dateFr = (iso: string) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return d && m && y ? `${d}/${m}/${y}` : iso;
};

export const totalDevis = (d: Devis) => {
  const ht = d.lignes.reduce((s, l) => s + l.quantite * l.prixUnitaire, 0);
  const remise = (ht * d.remise) / 100;
  const baseHt = ht - remise;
  const tva = (baseHt * d.tva) / 100;
  return { ht, remise, baseHt, tva, ttc: baseHt + tva };
};
