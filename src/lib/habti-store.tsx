import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  clientsSeed, devisSeed, employesSeed, facturesSeed, missionsSeed, paiementsSeed,
  prestationsSeed, prospectsSeed, reservationsSeed, ticketsSeed, socialPostsSeed, campagnesSeed, faqSeed, knowledgeSeed, newId,
  agentSettingsSeed,
  type Client, type Devis, type Employe, type Facture, type Mission, type Paiement,
  type Prestation, type Prospect, type Reservation, type Ticket, type SocialPost, type Campagne, type FAQItem, type KnowledgeItem,
  type AgentSettings,
} from "./habti-data";

type Store = {
  prospects: Prospect[]; clients: Client[]; reservations: Reservation[]; devis: Devis[];
  paiements: Paiement[]; factures: Facture[]; missions: Mission[]; employes: Employe[];
  prestations: Prestation[]; tickets: Ticket[]; socialPosts: SocialPost[]; campagnes: Campagne[]; faq: FAQItem[]; knowledge: KnowledgeItem[];
  addProspect: (p: Prospect) => void;
  updateProspect: (id: string, patch: Partial<Prospect>) => void;
  addProspectNote: (id: string, texte: string) => void;
  addClient: (c: Client) => void;
  addReservation: (r: Reservation) => void;
  updateReservation: (id: string, patch: Partial<Reservation>) => void;
  addDevis: (d: Devis) => void;
  updateDevis: (id: string, patch: Partial<Devis>) => void;
  addPaiement: (p: Paiement) => void;
  addFacture: (f: Facture) => void;
  updateFacture: (id: string, patch: Partial<Facture>) => void;
  addMission: (m: Mission) => void;
  updateMission: (id: string, patch: Partial<Mission>) => void;
  toggleChecklist: (missionId: string, itemId: string) => void;
  addEmploye: (e: Employe) => void;
  updateEmploye: (id: string, patch: Partial<Employe>) => void;
  addPrestation: (p: Prestation) => void;
  updatePrestation: (id: string, patch: Partial<Prestation>) => void;
  updateTicket: (id: string, patch: Partial<Ticket>) => void;
  addTicketMessage: (id: string, texte: string, auteur: "habti" | "ia") => void;
  addSocialPost: (p: SocialPost) => void; updateSocialPost: (id: string, patch: Partial<SocialPost>) => void; removeSocialPost: (id: string) => void;
  addCampagne: (c: Campagne) => void; updateCampagne: (id: string, patch: Partial<Campagne>) => void;
  addFaq: (f: FAQItem) => void; updateFaq: (id: string, patch: Partial<FAQItem>) => void; removeFaq: (id: string) => void;
  addKnowledge: (k: KnowledgeItem) => void; updateKnowledge: (id: string, patch: Partial<KnowledgeItem>) => void; removeKnowledge: (id: string) => void;
  agentSettings: AgentSettings; updateAgentSettings: (patch: Partial<AgentSettings>) => void; resetAgentSettings: () => void;
  notify: (message: string) => void;
};

const HabtiContext = createContext<Store | null>(null);

const patchList = <T extends { id: string }>(list: T[], id: string, patch: Partial<T>) =>
  list.map((item) => (item.id === id ? { ...item, ...patch } : item));

export function HabtiProvider({ children }: { children: ReactNode }) {
  const [prospects, setProspects] = useState<Prospect[]>(prospectsSeed);
  const [clients, setClients] = useState<Client[]>(clientsSeed);
  const [reservations, setReservations] = useState<Reservation[]>(reservationsSeed);
  const [devis, setDevis] = useState<Devis[]>(devisSeed);
  const [paiements, setPaiements] = useState<Paiement[]>(paiementsSeed);
  const [factures, setFactures] = useState<Facture[]>(facturesSeed);
  const [missions, setMissions] = useState<Mission[]>(missionsSeed);
  const [employes, setEmployes] = useState<Employe[]>(employesSeed);
  const [prestations, setPrestations] = useState<Prestation[]>(prestationsSeed);
  const [tickets, setTickets] = useState<Ticket[]>(ticketsSeed);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(socialPostsSeed);
  const [campagnes, setCampagnes] = useState<Campagne[]>(campagnesSeed);
  const [faq, setFaq] = useState<FAQItem[]>(faqSeed);
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(knowledgeSeed);
  const [agentSettings, setAgentSettings] = useState<AgentSettings>(agentSettingsSeed);

  const value = useMemo<Store>(() => ({
    prospects, clients, reservations, devis, paiements, factures, missions, employes, prestations, tickets, socialPosts, campagnes, faq, knowledge,
    agentSettings,
    updateAgentSettings: (patch) => setAgentSettings((s) => ({ ...s, ...patch })),
    resetAgentSettings: () => setAgentSettings(agentSettingsSeed),
    notify: (m) => toast.success(m),
    addProspect: (p) => setProspects((l) => [p, ...l]),
    updateProspect: (id, patch) => setProspects((l) => patchList(l, id, patch)),
    addProspectNote: (id, texte) => setProspects((l) => l.map((p) => p.id === id ? {
      ...p,
      notes: [{ id: newId("n"), texte, date: new Date().toLocaleDateString("fr-FR"), auteur: "Salma Bennani" }, ...p.notes],
      historique: [{ texte: "Note interne ajoutée", date: new Date().toLocaleString("fr-FR") }, ...p.historique],
    } : p)),
    addClient: (c) => setClients((l) => [c, ...l]),
    addReservation: (r) => setReservations((l) => [r, ...l]),
    updateReservation: (id, patch) => setReservations((l) => patchList(l, id, patch)),
    addDevis: (d) => setDevis((l) => [d, ...l]),
    updateDevis: (id, patch) => setDevis((l) => patchList(l, id, patch)),
    addPaiement: (p) => setPaiements((l) => [p, ...l]),
    addFacture: (f) => setFactures((l) => [f, ...l]),
    updateFacture: (id, patch) => setFactures((l) => patchList(l, id, patch)),
    addMission: (m) => setMissions((l) => [m, ...l]),
    updateMission: (id, patch) => setMissions((l) => patchList(l, id, patch)),
    toggleChecklist: (missionId, itemId) => setMissions((l) => l.map((m) => m.id === missionId ? {
      ...m, checklist: m.checklist.map((c) => (c.id === itemId ? { ...c, fait: !c.fait } : c)),
    } : m)),
    addEmploye: (e) => setEmployes((l) => [e, ...l]),
    updateEmploye: (id, patch) => setEmployes((l) => patchList(l, id, patch)),
    addPrestation: (p) => setPrestations((l) => [p, ...l]),
    updatePrestation: (id, patch) => setPrestations((l) => patchList(l, id, patch)),
    updateTicket: (id, patch) => setTickets((l) => patchList(l, id, patch)),
    addTicketMessage: (id, texte, auteur) => setTickets((l) => l.map((t) => t.id === id ? {
      ...t,
      mode: auteur === "habti" ? "Humain" : t.mode,
      messages: [...t.messages, { id: newId("m"), auteur, texte, heure: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }],
    } : t)),
    addSocialPost: (p) => setSocialPosts((l) => [p, ...l]),
    updateSocialPost: (id, patch) => setSocialPosts((l) => patchList(l, id, patch)),
    removeSocialPost: (id) => setSocialPosts((l) => l.filter((p) => p.id !== id)),
    addCampagne: (c) => setCampagnes((l) => [c, ...l]),
    updateCampagne: (id, patch) => setCampagnes((l) => patchList(l, id, patch)),
    addFaq: (f) => setFaq((l) => [f, ...l]),
    updateFaq: (id, patch) => setFaq((l) => patchList(l, id, patch)),
    removeFaq: (id) => setFaq((l) => l.filter((f) => f.id !== id)),
    addKnowledge: (k) => setKnowledge((l) => [k, ...l]),
    updateKnowledge: (id, patch) => setKnowledge((l) => patchList(l, id, patch)),
    removeKnowledge: (id) => setKnowledge((l) => l.filter((k) => k.id !== id)),
  }), [prospects, clients, reservations, devis, paiements, factures, missions, employes, prestations, tickets, socialPosts, campagnes, faq, knowledge, agentSettings]);

  return <HabtiContext.Provider value={value}>{children}</HabtiContext.Provider>;
}

export function useHabti() {
  const ctx = useContext(HabtiContext);
  if (!ctx) throw new Error("useHabti doit être utilisé dans HabtiProvider");
  return ctx;
}
