import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Bot, CalendarDays, CheckCircle2, Clock3, CreditCard, FileText, MapPin, Megaphone, Plus, Save, Send, Sparkles, UserCheck, Users, Wallet } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog, EmptyState, Field, FormModal, Metric, Panel, PanelTitle, SelectInput, StatutBadge, TextArea, TextInput } from "@/components/habti/ui-bits";
import { HabtiLogo } from "@/components/habti/logo";
import { useHabti } from "@/lib/habti-store";
import { STATUTS_CAMPAGNE, STATUTS_DEVIS, STATUTS_MISSION, STATUTS_PUBLICATION, STATUTS_RESERVATION, dateFr, euro, newId, totalDevis, type Devis, type Mission } from "@/lib/habti-data";

function NotFoundEntity({ titre, retour }: { titre: string; retour: string }) {
  const navigate = useNavigate();
  return <Panel><EmptyState titre={titre} description="L'élément demandé n'existe pas dans les données de démonstration." ctaLabel="Revenir à la liste" onCta={() => navigate({ to: retour })} /></Panel>;
}

export function ProspectDetailView({ id }: { id: string }) {
  const navigate = useNavigate();
  const { prospects, updateProspect, addProspectNote, addClient, notify } = useHabti();
  const prospect = prospects.find((p) => p.id === id);
  const [note, setNote] = useState("");
  const [convertir, setConvertir] = useState(false);
  if (!prospect) return <NotFoundEntity titre="Prospect introuvable" retour="/prospects" />;
  const progress = Math.min(100, Math.max(10, prospect.score));
  return (
    <div className="module-stack detail-page">
      <div className="detail-hero">
        <Button variant="ghost" onClick={() => navigate({ to: "/prospects" })}><ArrowLeft />Retour aux prospects</Button>
        <div className="detail-hero-main">
          <Avatar><AvatarFallback>{prospect.prenom[0]}{prospect.nom[0]}</AvatarFallback></Avatar>
          <div><h2>{prospect.prenom} {prospect.nom}</h2><p>{prospect.typeDemande} · {prospect.ville} · {prospect.telephone}</p></div>
          <StatutBadge statut={prospect.statut} />
        </div>
        <div className="detail-actions">
          <Button variant="outline" onClick={() => updateProspect(prospect.id, { statut: "Qualifié" })}>Qualifier</Button>
          <Button variant="outline" onClick={() => navigate({ to: "/devis", search: { nouveau: "1" } })}><FileText />Créer un devis</Button>
          <Button onClick={() => setConvertir(true)}><UserCheck />Convertir en client</Button>
        </div>
      </div>
      <section className="metrics-grid metrics-4">
        <Metric label="Score IA" value={`${prospect.score}/100`} icon={Sparkles} />
        <Metric label="Budget" value={euro(prospect.budget)} icon={Wallet} tone="gold" />
        <Metric label="Participants" value={String(prospect.personnes)} icon={Users} />
        <Metric label="Date souhaitée" value={dateFr(prospect.dateSouhaitee)} icon={CalendarDays} />
      </section>
      <Tabs defaultValue="apercu" className="detail-tabs">
        <TabsList><TabsTrigger value="apercu">Aperçu</TabsTrigger><TabsTrigger value="qualification">Qualification IA</TabsTrigger><TabsTrigger value="historique">Historique</TabsTrigger></TabsList>
        <TabsContent value="apercu"><Panel><PanelTitle title="Dossier prospect" subtitle="Informations commerciales et préférences de voyage" /><div className="data-grid"><div><span>E-mail</span><b>{prospect.email}</b></div><div><span>Source</span><b>{prospect.source}</b></div><div><span>Mood</span><b>{prospect.mood}</b></div><div><span>Conseiller</span><b>{prospect.conseiller}</b></div><div><span>Activités souhaitées</span><b>{prospect.activites}</b></div><div><span>Créé le</span><b>{dateFr(prospect.createdAt)}</b></div></div></Panel></TabsContent>
        <TabsContent value="qualification"><Panel><PanelTitle title="Analyse de qualification" subtitle="Décision assistée, validée par l'équipe" /><div className="qualification"><div><span>Probabilité de conversion</span><b>{prospect.score}<small>/100</small></b></div><Progress value={progress} /><p><Sparkles />Recommandation : préparer une offre premium adaptée à {prospect.ville}.</p></div><div className="next-action"><div><Bot /><b>Suggestion à approuver</b></div><p>Envoyer un devis personnalisé avec deux options complémentaires et un délai de réponse de 48 h.</p><Button onClick={() => { updateProspect(prospect.id, { statut: "Proposition à préparer" }); notify("Suggestion IA approuvée."); }}>Approuver la suggestion</Button></div></Panel></TabsContent>
        <TabsContent value="historique"><Panel><PanelTitle title="Notes et activité" subtitle="Toutes les interactions restent traçables" /><form className="note-form" onSubmit={(e) => { e.preventDefault(); if (!note.trim()) return; addProspectNote(prospect.id, note.trim()); setNote(""); notify("Note ajoutée."); }}><TextInput placeholder="Ajouter une note interne…" value={note} onChange={(e) => setNote(e.currentTarget.value)} /><Button type="submit" disabled={!note.trim()}>Ajouter</Button></form><div className="mini-timeline">{prospect.notes.map((n) => <p key={n.id}><i />{n.texte} <span>{n.date}</span></p>)}{prospect.historique.map((h, i) => <p key={`${h.date}-${i}`}><i />{h.texte} <span>{h.date}</span></p>)}</div></Panel></TabsContent>
      </Tabs>
      <ConfirmDialog open={convertir} onOpenChange={setConvertir} titre="Convertir ce prospect en client ?" description="Une fiche client sera créée et le prospect passera au statut Client." confirmLabel="Convertir" onConfirm={() => { addClient({ id: newId("C"), nom: `${prospect.prenom} ${prospect.nom}`, ville: prospect.ville, email: prospect.email, telephone: prospect.telephone, segment: "Particulier", reservations: 0, chiffreAffaires: 0, depuis: "2026" }); updateProspect(prospect.id, { statut: "Client" }); setConvertir(false); notify("Prospect converti en client."); }} />
    </div>
  );
}

export function ClientDetailView({ id }: { id: string }) {
  const navigate = useNavigate();
  const { clients, reservations, devis, factures, tickets, notify } = useHabti();
  const client = clients.find((c) => c.id === id);
  if (!client) return <NotFoundEntity titre="Client introuvable" retour="/clients" />;
  const relatedReservations = reservations.filter((r) => r.client === client.nom);
  const relatedDevis = devis.filter((d) => d.client === client.nom);
  const relatedFactures = factures.filter((f) => f.client === client.nom);
  const relatedTickets = tickets.filter((t) => t.client === client.nom);
  return (
    <div className="module-stack detail-page">
      <div className="detail-hero"><Button variant="ghost" onClick={() => navigate({ to: "/clients" })}><ArrowLeft />Retour aux clients</Button><div className="detail-hero-main"><Avatar><AvatarFallback>{client.nom.slice(0,2).toUpperCase()}</AvatarFallback></Avatar><div><h2>{client.nom}</h2><p>{client.segment} · {client.ville} · client depuis {client.depuis}</p></div></div><div className="detail-actions"><Button variant="outline" onClick={() => navigate({ to: "/devis", search: { nouveau: "1" } })}>Créer un devis</Button><Button onClick={() => navigate({ to: "/reservations", search: { nouveau: "1" } })}>Nouvelle réservation</Button></div></div>
      <section className="metrics-grid metrics-4"><Metric label="Chiffre d'affaires" value={euro(client.chiffreAffaires)} icon={Wallet} tone="gold" /><Metric label="Réservations" value={String(client.reservations)} icon={CalendarDays} /><Metric label="Devis" value={String(relatedDevis.length)} icon={FileText} /><Metric label="Tickets" value={String(relatedTickets.length)} icon={Bot} /></section>
      <Tabs defaultValue="activite"><TabsList><TabsTrigger value="activite">Activité</TabsTrigger><TabsTrigger value="finance">Finance</TabsTrigger><TabsTrigger value="support">Service client</TabsTrigger></TabsList><TabsContent value="activite"><Panel><PanelTitle title="Réservations liées" subtitle="Historique opérationnel du compte" />{relatedReservations.map((r) => <button className="detail-row" key={r.id} onClick={() => navigate({ to: "/reservations/$id", params: { id: r.id } })}><span>{r.reference}</span><b>{r.prestation}</b><small>{dateFr(r.date)} · {r.statut}</small></button>)}{!relatedReservations.length && <p className="muted-line">Aucune réservation liée.</p>}</Panel></TabsContent><TabsContent value="finance"><Panel><PanelTitle title="Documents financiers" subtitle="Devis et factures du client" />{[...relatedDevis.map((d) => ({ id: d.id, titre: d.reference, sous: `Devis · ${d.statut}`, montant: euro(totalDevis(d).ttc), to: "/devis/$id" as const })), ...relatedFactures.map((f) => ({ id: f.id, titre: f.reference, sous: `Facture · ${f.statut}`, montant: euro(f.montant), to: "/factures" as const }))].map((x) => <button className="detail-row" key={x.titre} onClick={() => x.to === "/devis/$id" ? navigate({ to: x.to, params: { id: x.id } }) : navigate({ to: x.to })}><span>{x.titre}</span><b>{x.montant}</b><small>{x.sous}</small></button>)}</Panel></TabsContent><TabsContent value="support"><Panel><PanelTitle title="Conversations" subtitle="Contexte relationnel et suivi humain" />{relatedTickets.map((t) => <button className="detail-row" key={t.id} onClick={() => navigate({ to: "/agent-service-client", search: { id: t.id } })}><span>{t.canal}</span><b>{t.sujet}</b><small>{t.statut}</small></button>)}<Button variant="outline" onClick={() => { navigate({ to: "/agent-service-client" }); notify("Espace service client ouvert."); }}>Ouvrir le service client</Button></Panel></TabsContent></Tabs>
    </div>
  );
}

export function OperationDetailView({ id }: { id: string }) {
  const navigate = useNavigate();
  const { missions, reservations, paiements, updateMission, toggleChecklist, notify } = useHabti();
  const mission = missions.find((m) => m.id === id);
  const [note, setNote] = useState("");
  const [approvals, setApprovals] = useState(["Confirmer chauffeur de secours", "Envoyer brief final au client", "Prévenir l'équipe restauration"]);
  if (!mission) return <NotFoundEntity titre="Opération introuvable" retour="/operations" />;
  const reservation = reservations.find((r) => r.client === mission.client || r.prestation === mission.activite);
  const paiement = paiements.find((p) => p.client === mission.client || p.rattachement === reservation?.reference);
  const done = mission.checklist.filter((c) => c.fait).length;
  const progress = Math.round((done / (mission.checklist.length || 1)) * 100);
  return (
    <div className="module-stack detail-page">
      <div className="detail-hero"><Button variant="ghost" onClick={() => navigate({ to: "/operations" })}><ArrowLeft />Retour aux opérations</Button><div className="detail-hero-main"><div className="detail-icon"><CheckCircle2 /></div><div><h2>{mission.titre}</h2><p>{mission.client} · {mission.lieu} · {dateFr(mission.date)} à {mission.heure}</p></div><StatutBadge statut={mission.statut} /></div><div className="detail-actions"><Button variant="outline" onClick={() => updateMission(mission.id, { statut: "En cours" })}>Démarrer</Button><Button onClick={() => updateMission(mission.id, { statut: "Terminée" })}>Terminer</Button></div></div>
      <section className="metrics-grid metrics-4"><Metric label="Avancement" value={`${progress}%`} icon={CheckCircle2} /><Metric label="Tâches restantes" value={String(mission.checklist.length - done)} icon={Clock3} /><Metric label="Équipe" value={String(mission.employes.length || 0)} icon={Users} /><Metric label="Paiement" value={paiement?.statut ?? "À vérifier"} icon={CreditCard} tone="gold" /></section>
      <Tabs defaultValue="taches"><TabsList><TabsTrigger value="taches">Tâches</TabsTrigger><TabsTrigger value="brief">Brief</TabsTrigger><TabsTrigger value="ia">Suggestions IA</TabsTrigger><TabsTrigger value="finance">Finance</TabsTrigger></TabsList><TabsContent value="taches"><Panel><PanelTitle title="Checklist opérationnelle" subtitle="Chaque validation met à jour l'avancement" /><Progress value={progress} /><div className="checklist">{mission.checklist.map((c) => <label key={c.id}><input type="checkbox" checked={c.fait} onChange={() => { toggleChecklist(mission.id, c.id); notify(c.fait ? "Étape rouverte." : "Étape validée."); }} /><span className={c.fait ? "done" : ""}>{c.label}</span></label>)}</div><form className="note-form" onSubmit={(e) => { e.preventDefault(); if (!note.trim()) return; updateMission(mission.id, { notes: [{ id: newId("n"), texte: note.trim(), date: new Date().toLocaleString("fr-FR"), auteur: "Salma Bennani" }, ...mission.notes] }); setNote(""); notify("Note ajoutée à l'opération."); }}><TextInput value={note} onChange={(e) => setNote(e.currentTarget.value)} placeholder="Ajouter une note terrain…" /><Button disabled={!note.trim()}>Ajouter</Button></form></Panel></TabsContent><TabsContent value="brief"><Panel><PanelTitle title="Brief terrain" subtitle="Informations partagées à l'équipe" /><div className="data-grid"><div><span>Client</span><b>{mission.client}</b></div><div><span>Activité</span><b>{mission.activite}</b></div><div><span>Lieu</span><b>{mission.lieu}</b></div><div><span>Équipe</span><b>{mission.employes.join(", ") || "Non affectée"}</b></div><div><span>Réservation</span><b>{reservation?.reference ?? "À créer"}</b></div><div><span>Notes</span><b>{reservation?.notes ?? "Aucune note"}</b></div></div></Panel></TabsContent><TabsContent value="ia"><Panel><PanelTitle title="Suggestions IA à valider" subtitle="Aucune action automatique sans validation humaine" />{approvals.map((a) => <div className="approval-row" key={a}><Sparkles /><span>{a}</span><Button size="sm" onClick={() => { setApprovals((l) => l.filter((x) => x !== a)); notify("Suggestion approuvée."); }}>Approuver</Button><Button size="sm" variant="outline" onClick={() => { setApprovals((l) => l.filter((x) => x !== a)); notify("Suggestion rejetée."); }}>Rejeter</Button></div>)}{!approvals.length && <p className="muted-line">Toutes les suggestions ont été traitées.</p>}</Panel></TabsContent><TabsContent value="finance"><Panel><PanelTitle title="Finance associée" subtitle="Suivi rapide du règlement" /><div className="data-grid"><div><span>Réservation</span><b>{reservation?.reference ?? "—"}</b></div><div><span>Montant</span><b>{reservation ? euro(reservation.tarif) : "—"}</b></div><div><span>Statut paiement</span><b>{paiement?.statut ?? "Non rapproché"}</b></div><div><span>Payé</span><b>{paiement ? euro(paiement.montantPaye) : "—"}</b></div></div><div className="drawer-actions"><Button variant="outline" onClick={() => navigate({ to: "/paiements" })}>Voir les paiements</Button><Button variant="outline" onClick={() => navigate({ to: "/factures" })}>Voir les factures</Button></div></Panel></TabsContent></Tabs>
    </div>
  );
}

export function ReservationDetailView({ id }: { id: string }) {
  const navigate = useNavigate();
  const { reservations, updateReservation, addMission, notify } = useHabti();
  const r = reservations.find((x) => x.id === id);
  if (!r) return <NotFoundEntity titre="Réservation introuvable" retour="/reservations" />;
  const confirmer = () => { updateReservation(r.id, { statut: "Confirmée" }); addMission({ id: newId("M"), titre: `Préparation ${r.prestation}`, client: r.client, activite: r.prestation, date: r.date, heure: r.heure, lieu: r.ville, employes: r.employe ? [r.employe] : [], statut: "Planifiée", checklist: [{ id: newId("c"), label: "Confirmer la logistique transport", fait: false }, { id: newId("c"), label: "Briefer l'équipe terrain", fait: false }], notes: [] }); notify("Réservation confirmée. Opération créée."); };
  return <div className="module-stack detail-page"><div className="detail-hero"><Button variant="ghost" onClick={() => navigate({ to: "/reservations" })}><ArrowLeft />Retour aux réservations</Button><div className="detail-hero-main"><div className="detail-icon"><CalendarDays /></div><div><h2>{r.prestation}</h2><p>{r.reference} · {r.client}</p></div><StatutBadge statut={r.statut} /></div><div className="detail-actions"><Button variant="outline" onClick={() => updateReservation(r.id, { statut: "En cours" })}>Démarrer</Button><Button onClick={confirmer}>Confirmer</Button></div></div><section className="metrics-grid metrics-4"><Metric label="Date" value={dateFr(r.date)} icon={CalendarDays} /><Metric label="Participants" value={String(r.participants)} icon={Users} /><Metric label="Tarif" value={euro(r.tarif)} icon={Wallet} tone="gold" /><Metric label="Ville" value={r.ville} icon={MapPin} /></section><Panel><PanelTitle title="Détails de réservation" subtitle="Logistique, notes et prochaines étapes" /><div className="data-grid"><div><span>Horaire</span><b>{r.heure}</b></div><div><span>Responsable</span><b>{r.employe || "Non affecté"}</b></div><div><span>Notes</span><b>{r.notes || "Aucune note"}</b></div><div><span>Statut</span><b>{r.statut}</b></div></div><div className="drawer-actions"><Button variant="outline" onClick={() => navigate({ to: "/devis", search: { nouveau: "1" } })}>Créer un devis</Button><Button variant="outline" onClick={() => navigate({ to: "/operations" })}>Voir les opérations</Button><Button variant="outline" onClick={() => updateReservation(r.id, { statut: "Annulée" })}>Annuler</Button></div></Panel></div>;
}

export function EmployeDetailView({ id }: { id: string }) {
  const navigate = useNavigate();
  const { employes, missions, updateEmploye, notify } = useHabti();
  const e = employes.find((x) => x.id === id);
  if (!e) return <NotFoundEntity titre="Employé introuvable" retour="/employes" />;
  const mine = missions.filter((m) => m.employes.includes(e.nom));
  return <div className="module-stack detail-page"><div className="detail-hero"><Button variant="ghost" onClick={() => navigate({ to: "/employes" })}><ArrowLeft />Retour aux employés</Button><div className="detail-hero-main"><Avatar><AvatarFallback>{e.initiales}</AvatarFallback></Avatar><div><h2>{e.nom}</h2><p>{e.role} · {e.ville}</p></div><StatutBadge statut={e.disponibilite} /></div><div className="detail-actions"><Button variant="outline" onClick={() => { updateEmploye(e.id, { disponibilite: "Disponible" }); notify("Disponibilité mise à jour."); }}>Marquer disponible</Button><Button onClick={() => navigate({ to: "/operations", search: { nouveau: "1" } })}>Affecter</Button></div></div><section className="metrics-grid metrics-3"><Metric label="Missions" value={String(e.missions)} icon={CheckCircle2} /><Metric label="Charge" value={`${e.charge}%`} icon={Clock3} tone="gold" /><Metric label="Spécialités" value={String(e.specialites.length)} icon={BadgeCheck} /></section><Panel><PanelTitle title="Profil opérationnel" subtitle="Compétences, planning et affectations" /><div className="data-grid"><div><span>Ville</span><b>{e.ville}</b></div><div><span>Disponibilité</span><b>{e.disponibilite}</b></div><div><span>Spécialités</span><b>{e.specialites.join(", ")}</b></div><div><span>Charge</span><b>{e.charge}%</b></div></div><h4 className="block-title">Missions liées</h4>{mine.map((m) => <button className="detail-row" key={m.id} onClick={() => navigate({ to: "/operations/$id", params: { id: m.id } })}><span>{dateFr(m.date)}</span><b>{m.titre}</b><small>{m.statut}</small></button>)}{!mine.length && <p className="muted-line">Aucune mission affectée.</p>}</Panel></div>;
}

export function DevisDetailView({ id }: { id: string }) {
  const navigate = useNavigate();
  const { devis, updateDevis, addFacture, notify } = useHabti();
  const d = devis.find((x) => x.id === id);
  if (!d) return <NotFoundEntity titre="Devis introuvable" retour="/devis" />;
  const totals = totalDevis(d);
  const accepter = () => { updateDevis(d.id, { statut: "Accepté" }); addFacture({ id: newId("F"), reference: `FA-2026-${Math.floor(Math.random() * 900 + 100)}`, client: d.client, montant: totals.ttc, date: new Date().toISOString().slice(0, 10), echeance: d.validite, statut: "Non payé", origine: d.reference }); notify("Devis accepté. Facture générée."); };
  return <div className="module-stack detail-page"><div className="detail-hero"><Button variant="ghost" onClick={() => navigate({ to: "/devis" })}><ArrowLeft />Retour aux devis</Button><div className="detail-hero-main"><div className="detail-icon"><FileText /></div><div><h2>{d.reference}</h2><p>{d.client} · valable jusqu'au {dateFr(d.validite)}</p></div><StatutBadge statut={d.statut} /></div><div className="detail-actions"><Button variant="outline" onClick={() => { updateDevis(d.id, { statut: "Envoyé" }); notify("Devis envoyé."); }}><Send />Envoyer</Button><Button onClick={accepter}>Accepter</Button></div></div><Panel><div className="document-preview"><header><HabtiLogo /><div><b>{d.reference}</b><span>Émis le {dateFr(d.date)}</span></div></header><p className="doc-client">Client : <b>{d.client}</b></p><table className="doc-table"><thead><tr><th>Désignation</th><th>Qté</th><th>P.U.</th><th>Total</th></tr></thead><tbody>{d.lignes.map((l) => <tr key={l.id}><td>{l.designation}</td><td>{l.quantite}</td><td>{euro(l.prixUnitaire)}</td><td>{euro(l.quantite * l.prixUnitaire)}</td></tr>)}</tbody></table><div className="doc-totals"><p><span>Total HT</span><b>{euro(totals.ht)}</b></p><p><span>Remise</span><b>-{euro(totals.remise)}</b></p><p><span>TVA</span><b>{euro(totals.tva)}</b></p><p className="grand"><span>Total TTC</span><b>{euro(totals.ttc)}</b></p></div></div><div className="doc-actions"><Button variant="outline" onClick={() => window.print()}>Télécharger le PDF</Button><Button variant="outline" onClick={() => updateDevis(d.id, { statut: "Refusé" })}>Refuser</Button><Button variant="outline" onClick={() => navigate({ to: "/factures" })}>Voir les factures</Button></div></Panel></div>;
}

export function SocialPostDetailView({ id }: { id: string }) {
  const navigate = useNavigate();
  const { socialPosts, updateSocialPost, notify } = useHabti();
  const post = socialPosts.find((x) => x.id === id);
  if (!post) return <NotFoundEntity titre="Publication introuvable" retour="/agent-community-manager" />;
  return <div className="module-stack detail-page"><div className="detail-hero"><Button variant="ghost" onClick={() => navigate({ to: "/agent-community-manager" })}><ArrowLeft />Retour au planning éditorial</Button><div className="detail-hero-main"><img src={post.image} alt="" className="detail-thumb" /><div><h2>{post.titre}</h2><p>{post.type} · {post.plateformes.join(", ")} · {dateFr(post.date)} à {post.heure}</p></div><StatutBadge statut={post.statut} /></div><div className="detail-actions"><Button variant="outline" onClick={() => updateSocialPost(post.id, { statut: "Validé" })}>Valider</Button><Button onClick={() => { updateSocialPost(post.id, { statut: "Publié" }); notify("Publication marquée comme publiée."); }}>Publier</Button></div></div><Panel><PanelTitle title="Contenu social" subtitle="Texte, hashtags et intention commerciale" /><div className="social-preview"><img src={post.image} alt={post.titre} /><div><h3>{post.titre}</h3><p>{post.legende}</p><strong>{post.hashtags}</strong><span>CTA : {post.cta} · Campagne : {post.campagne}</span></div></div></Panel></div>;
}

export function CampagneDetailView({ id }: { id: string }) {
  const navigate = useNavigate();
  const { campagnes, updateCampagne, notify } = useHabti();
  const c = campagnes.find((x) => x.id === id);
  if (!c) return <NotFoundEntity titre="Campagne introuvable" retour="/campagnes" />;
  return <div className="module-stack detail-page"><div className="detail-hero"><Button variant="ghost" onClick={() => navigate({ to: "/campagnes" })}><ArrowLeft />Retour aux campagnes</Button><div className="detail-hero-main"><div className="detail-icon"><Megaphone /></div><div><h2>{c.nom}</h2><p>{c.canal} · {c.audience} · {dateFr(c.date)}</p></div><StatutBadge statut={c.statut} /></div><div className="detail-actions"><Button variant="outline" onClick={() => updateCampagne(c.id, { statut: "Programmée" })}>Programmer</Button><Button onClick={() => { updateCampagne(c.id, { statut: "En cours", ouverture: Math.max(c.ouverture, 12), lecture: Math.max(c.lecture, 8) }); notify("Campagne lancée."); }}><Send />Lancer</Button></div></div><section className="metrics-grid metrics-4"><Metric label="Destinataires" value={String(c.destinataires)} icon={Users} /><Metric label="Ouverture" value={`${c.ouverture}%`} icon={BadgeCheck} /><Metric label="Lecture" value={`${c.lecture}%`} icon={Clock3} /><Metric label="Canal" value={c.canal} icon={Megaphone} tone="gold" /></section><Panel><PanelTitle title="Message de campagne" subtitle="Aperçu envoyé à l'audience" /><div className="campaign-message"><b>{c.nom}</b><p>{c.message}</p><Button onClick={() => notify(`Aperçu ${c.canal} envoyé à Salma.`)}>{c.cta}</Button></div><div className="drawer-actions"><Button variant="outline" onClick={() => updateCampagne(c.id, { statut: "Terminée" })}>Clôturer</Button><Button variant="outline" onClick={() => navigate({ to: "/prospects" })}>Voir les prospects</Button></div></Panel></div>;
}
