import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { MessagesSquare, Search, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, FormModal, Field, Panel, PanelTitle, StatutBadge, TextArea, TextInput } from "@/components/habti/ui-bits";
import { useHabti } from "@/lib/habti-store";
import { STATUTS_TICKET } from "@/lib/habti-data";

const reponsesIA = (sujet: string) =>
  `Bonjour, merci pour votre message concernant « ${sujet} ». Nous avons vérifié votre dossier : tout est confirmé de notre côté. Un conseiller Habti Voyage vous recontacte dans l'heure avec le détail complet et le point de rendez-vous. Bien à vous, l'équipe Habti Voyage.`;

export function ServiceClientView() {
  const navigate = useNavigate();
  const { tickets, updateTicket, addTicketMessage, notify } = useHabti();
  const [q, setQ] = useState("");
  const [actifId, setActifId] = useState(tickets[0]?.id ?? "");
  const [message, setMessage] = useState("");
  const [tache, setTache] = useState(false);

  const liste = useMemo(
    () => tickets.filter((t) => `${t.client} ${t.sujet}`.toLowerCase().includes(q.toLowerCase())),
    [tickets, q],
  );
  const actif = tickets.find((t) => t.id === actifId) ?? liste[0];

  const envoyer = (texte: string, auteur: "habti" | "ia") => {
    if (!actif || !texte.trim()) return;
    addTicketMessage(actif.id, texte, auteur);
    updateTicket(actif.id, { statut: auteur === "ia" ? "Pris en charge par l'IA" : "En cours" });
    setMessage("");
    notify(auteur === "ia" ? "Réponse IA envoyée au client." : "Réponse envoyée au client.");
  };

  return (
    <div className="support-layout">
      <Panel className="support-list">
        <div className="smart-filter">
          <div><Search /><input placeholder="Rechercher une conversation…" value={q} onChange={(e) => setQ(e.currentTarget.value)} /></div>
        </div>
        {liste.length === 0 ? (
          <EmptyState titre="Aucune conversation ne correspond à votre recherche." ctaLabel="Réinitialiser la recherche" onCta={() => setQ("")} icon={MessagesSquare} />
        ) : liste.map((t) => (
          <button key={t.id} className={`support-item ${actif?.id === t.id ? "active" : ""}`} onClick={() => setActifId(t.id)}>
            <div><b>{t.client}</b><StatutBadge statut={t.statut} /></div>
            <p>{t.sujet}</p>
            <span>{t.canal} · {t.messages[t.messages.length - 1]?.heure}</span>
          </button>
        ))}
      </Panel>

      {actif ? (
        <>
          <Panel className="support-thread">
            <PanelTitle title={actif.sujet} subtitle={`${actif.client} · ${actif.canal}`} />
            <div className="thread-body">
              {actif.messages.map((m) => (
                <div key={m.id} className={`thread-msg ${m.auteur}`}>
                  <p>{m.texte}</p>
                  <span>{m.auteur === "client" ? actif.client : m.auteur === "ia" ? "Assistant IA" : "Habti Voyage"} · {m.heure}</span>
                </div>
              ))}
            </div>
            <div className="thread-composer">
              <TextArea value={message} onChange={(e) => setMessage(e.currentTarget.value)} placeholder="Écrire une réponse au client…" />
              <div className="composer-actions">
                <Button variant="outline" onClick={() => setMessage(reponsesIA(actif.sujet))}><Sparkles />Proposer une réponse IA</Button>
                <Button variant="outline" onClick={() => envoyer(reponsesIA(actif.sujet), "ia")}>Envoyer la réponse IA</Button>
                <Button onClick={() => envoyer(message, "habti")} disabled={!message.trim()}><Send />Répondre</Button>
              </div>
            </div>
          </Panel>

          <Panel className="support-context">
            <PanelTitle title="Contexte client" subtitle="Informations rattachées à la conversation" />
            <div className="data-grid">
              <div><span>Client</span><b>{actif.client}</b></div>
              <div><span>Réservation</span><b>{actif.reservation}</b></div>
              <div><span>Paiement</span><b>{actif.paiement}</b></div>
              <div><span>Statut</span><b>{actif.statut}</b></div>
            </div>
            <div className="ia-summary">
              <h4><Sparkles />Résumé IA</h4>
              <p>{actif.resume}</p>
            </div>
            <div className="mini-timeline">
              <h4>Demandes précédentes</h4>
              <p><i />Confirmation d'horaire — résolue</p>
              <p><i />Demande de facture — résolue</p>
            </div>
            <div className="drawer-actions column">
              <Button variant="outline" onClick={() => { updateTicket(actif.id, { statut: "Transféré à un conseiller" }); notify("Conversation transférée à un conseiller."); }}>Transférer à un conseiller</Button>
              <Button variant="outline" onClick={() => setTache(true)}>Créer une tâche</Button>
              <Button variant="outline" onClick={() => navigate({ to: "/clients" })}>Voir le client</Button>
              <Button variant="outline" onClick={() => { updateTicket(actif.id, { statut: "Fermé" }); notify("Conversation fermée."); }}>Fermer la conversation</Button>
            </div>
            <div className="statut-switch">
              <span>Changer le statut</span>
              <select className="habti-input" value={actif.statut} onChange={(e) => { updateTicket(actif.id, { statut: e.currentTarget.value as typeof actif.statut }); notify("Statut mis à jour."); }}>
                {STATUTS_TICKET.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </Panel>

          <FormModal open={tache} onOpenChange={setTache} title="Créer une tâche" submitLabel="Créer la tâche"
            onSubmit={(e) => { e.preventDefault(); setTache(false); notify("Tâche créée et affectée."); }}>
            <Field label="Intitulé" full><TextInput required defaultValue={`Suivi — ${actif.sujet}`} /></Field>
            <Field label="Échéance"><TextInput type="date" defaultValue="2026-09-18" /></Field>
            <Field label="Responsable"><TextInput defaultValue="Salma Bennani" /></Field>
            <Field label="Détails" full><TextArea placeholder="Contexte de la tâche…" /></Field>
          </FormModal>
        </>
      ) : (
        <Panel className="support-thread"><EmptyState titre="Aucune conversation sélectionnée." description="Choisissez une conversation à gauche pour commencer." icon={MessagesSquare} /></Panel>
      )}
    </div>
  );
}
