import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft, BadgeCheck, Bot, CalendarDays, CheckCircle2, Clock3, CreditCard, Download, Eye, FileText,
  MapPin, Megaphone, Send, Sparkles, Trash2, UserCheck, Users, Wallet,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfirmDialog, EmptyState, Field, FormModal, Metric, Panel, PanelTitle, SelectInput, StatutBadge, TextArea, TextInput } from "@/components/habti/ui-bits";
import { HabtiLogo } from "@/components/habti/logo";
import { useHabti } from "@/lib/habti-store";
import { clientAnalyse, prospectAnalyse, prospectConversations, prospectDocuments, prospectSuggestions } from "@/lib/habti-insights";
import { STATUTS_PROSPECT, dateFr, euro, newId, totalDevis, type Prospect } from "@/lib/habti-data";

function NotFoundEntity({ titre, retour }: { titre: string; retour: string }) {
  const navigate = useNavigate();
  return <Panel><EmptyState titre={titre} description="L'élément demandé n'existe pas dans les données de démonstration." ctaLabel="Revenir à la liste" onCta={() => navigate({ to: retour })} /></Panel>;
}

function Breadcrumb({ to, parent, courant }: { to: string; parent: string; courant: string }) {
  return <nav className="breadcrumb"><Link to={to}>{parent}</Link><span>/</span><b>{courant}</b></nav>;
}

function Radial({ label, valeur }: { label: string; valeur: number }) {
  return (
    <div className="radial" style={{ ["--v" as string]: `${valeur * 3.6}deg` }}>
      <div className="radial-ring"><b>{valeur}</b></div>
      <span>{label}</span>
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return <div className="criteria-chips">{items.filter(Boolean).map((c, i) => <span key={`${c}-${i}`}>{c}</span>)}</div>;
}

function DocumentsPanel({ documents, onNotify }: { documents: { id: string; nom: string; type: string; date: string; taille: string; statut: string }[]; onNotify: (m: string) => void }) {
  const [liste, setListe] = useState(documents);
  return (
    <Panel>
      <PanelTitle title="Documents" subtitle="Pièces partagées avec le dossier" />
      <div className="file-grid">
        {liste.map((d) => (
          <div className="file-card" key={d.id}>
            <FileText />
            <div><b>{d.nom}</b><span>{d.type} · {d.taille} · {d.date}</span></div>
            <StatutBadge statut={d.statut === "Validé" ? "Accepté" : d.statut === "Envoyé" ? "Envoyé" : "Brouillon"} />
            <div className="card-actions">
              <Button size="sm" variant="outline" onClick={() => onNotify(`Aperçu de ${d.nom} ouvert.`)}><Eye />Aperçu</Button>
              <Button size="sm" variant="outline" onClick={() => onNotify(`${d.nom} téléchargé (démonstration).`)}><Download />Télécharger</Button>
              <Button size="sm" variant="outline" onClick={() => { setListe((l) => l.filter((x) => x.id !== d.id)); onNotify("Document supprimé."); }}><Trash2 />Supprimer</Button>
            </div>
          </div>
        ))}
        {!liste.length && <p className="muted-line">Aucun document dans ce dossier.</p>}
      </div>
    </Panel>
  );
}

/* ============================ PROSPECT ============================ */

export function ProspectDetailView({ id }: { id: string }) {
  const navigate = useNavigate();
  const { prospects, devis, reservations, prestations, updateProspect, addProspectNote, addClient, notify } = useHabti();
  const prospect = prospects.find((p) => p.id === id);
  const [note, setNote] = useState("");
  const [convertir, setConvertir] = useState(false);
  const [edition, setEdition] = useState(false);
  const [affectation, setAffectation] = useState(false);
  const [retirees, setRetirees] = useState<string[]>([]);

  const analyse = useMemo(() => (prospect ? prospectAnalyse(prospect) : null), [prospect]);
  const conversations = useMemo(() => (prospect ? prospectConversations(prospect) : []), [prospect]);
  const documents = useMemo(() => (prospect ? prospectDocuments(prospect) : []), [prospect]);
  const suggestions = useMemo(() => (prospect ? prospectSuggestions(prospect, prestations) : []), [prospect, prestations]);

  if (!prospect || !analyse) return <NotFoundEntity titre="Prospect introuvable" retour="/prospects" />;

  const nomComplet = `${prospect.prenom} ${prospect.nom}`;
  const devisLies = devis.filter((d) => d.client === nomComplet || d.client === prospect.nom);
  const reservationsLiees = reservations.filter((r) => r.client === nomComplet);

  return (
    <div className="module-stack detail-page">
      <Breadcrumb to="/prospects" parent="Prospects" courant={nomComplet} />
      <div className="detail-hero">
        <Button variant="ghost" onClick={() => navigate({ to: "/prospects" })}><ArrowLeft />Retour aux prospects</Button>
        <div className="detail-hero-main">
          <Avatar><AvatarFallback>{prospect.prenom[0]}{prospect.nom[0]}</AvatarFallback></Avatar>
          <div>
            <h2>{nomComplet}</h2>
            <p><MapPin />{prospect.ville} · Source {prospect.source} · Conseiller {prospect.conseiller}</p>
          </div>
          <div className="hero-score"><b>{prospect.score}</b><span>Lead score</span></div>
          <StatutBadge statut={prospect.statut} />
        </div>
        <div className="detail-actions">
          <Button variant="outline" onClick={() => setEdition(true)}>Modifier</Button>
          <Button variant="outline" onClick={() => notify(`Message envoyé à ${prospect.email} (démonstration).`)}>Contacter</Button>
          <Button variant="outline" onClick={() => navigate({ to: "/devis", search: { nouveau: "1" } })}><FileText />Créer un devis</Button>
          <Button variant="outline" onClick={() => navigate({ to: "/reservations", search: { nouveau: "1" } })}>Créer une réservation</Button>
          <Button variant="outline" onClick={() => setAffectation(true)}>Affecter</Button>
          <Button onClick={() => setConvertir(true)}><UserCheck />Marquer comme client</Button>
        </div>
      </div>

      <section className="metrics-grid metrics-4">
        <Metric label="Score IA" value={`${prospect.score}/100`} icon={Sparkles} />
        <Metric label="Budget" value={euro(prospect.budget)} icon={Wallet} tone="gold" />
        <Metric label="Participants" value={String(prospect.personnes)} icon={Users} />
        <Metric label="Date souhaitée" value={dateFr(prospect.dateSouhaitee)} icon={CalendarDays} />
      </section>

      <Tabs defaultValue="apercu" className="detail-tabs">
        <TabsList>
          <TabsTrigger value="apercu">Vue d’ensemble</TabsTrigger>
          <TabsTrigger value="analyse">Analyse IA</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions IA</TabsTrigger>
          <TabsTrigger value="devis">Devis</TabsTrigger>
          <TabsTrigger value="reservations">Réservations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="apercu">
          <div className="detail-columns">
            <Panel>
              <PanelTitle title="Informations personnelles" subtitle="Coordonnées et contexte de la demande" />
              <div className="data-grid">
                <div><span>Téléphone</span><b>{prospect.telephone}</b></div>
                <div><span>E-mail</span><b>{prospect.email}</b></div>
                <div><span>Ville</span><b>{prospect.ville}</b></div>
                <div><span>Source</span><b>{prospect.source}</b></div>
                <div><span>Date de création</span><b>{dateFr(prospect.createdAt)}</b></div>
                <div><span>Budget</span><b>{euro(prospect.budget)}</b></div>
                <div><span>Nombre de personnes</span><b>{prospect.personnes}</b></div>
                <div><span>Dates souhaitées</span><b>{dateFr(prospect.dateSouhaitee)}</b></div>
                <div><span>Activités demandées</span><b>{prospect.activites || "—"}</b></div>
                <div><span>Type de voyage</span><b>{prospect.typeDemande}</b></div>
                <div><span>Mood</span><b>{prospect.mood}</b></div>
                <div><span>Préférences</span><b>{analyse.interets.slice(0, 3).join(", ")}</b></div>
                <div><span>Langue</span><b>Français</b></div>
                <div><span>Responsable</span><b>{prospect.conseiller}</b></div>
                <div><span>Statut</span><b>{prospect.statut}</b></div>
              </div>
            </Panel>
            <Panel className="summary-card">
              <PanelTitle title="Résumé de la demande" subtitle="Synthèse générée à partir des échanges" />
              <p className="summary-text">{analyse.resume}</p>
              <Chips items={analyse.criteres} />
              <Button onClick={() => navigate({ to: "/devis", search: { nouveau: "1" } })}>Préparer une proposition</Button>
            </Panel>
          </div>
        </TabsContent>

        <TabsContent value="analyse">
          <Panel>
            <PanelTitle title="Analyse IA du prospect" subtitle="Indicateurs calculés à partir du profil et des échanges" />
            <div className="radial-grid">{analyse.kpis.map((k) => <Radial key={k.label} label={k.label} valeur={k.valeur} />)}</div>
          </Panel>
          <div className="detail-columns">
            <Panel>
              <PanelTitle title="Lecture comportementale" subtitle="Mood, intention et freins détectés" />
              <div className="data-grid">
                <div><span>Mood détecté</span><b>{analyse.mood}</b></div>
                <div><span>Intent principal</span><b>{analyse.intent}</b></div>
              </div>
              <h4 className="block-title">Freins potentiels</h4>
              <Chips items={analyse.freins} />
              <h4 className="block-title">Centres d’intérêt</h4>
              <Chips items={analyse.interets} />
              <h4 className="block-title">Signaux d’achat</h4>
              <Chips items={analyse.signaux} />
            </Panel>
            <Panel className="ai-card">
              <PanelTitle title="Résumé IA" subtitle="Aucune action n’est exécutée sans validation humaine" />
              <p className="summary-text">{analyse.resume}</p>
              <div className="next-action">
                <div><Bot /><b>Prochaine action recommandée</b></div>
                <p>{analyse.prochaineAction}</p>
                <Button onClick={() => { updateProspect(prospect.id, { statut: "Proposition à préparer" }); notify("Action IA approuvée : proposition à préparer."); }}>Approuver</Button>
                <Button variant="outline" onClick={() => notify("Recommandation refusée.")}>Refuser</Button>
              </div>
            </Panel>
          </div>
        </TabsContent>

        <TabsContent value="conversations">
          <Panel>
            <PanelTitle title="Conversations" subtitle="Historique omnicanal complet du prospect" />
            {conversations.map((c) => (
              <div className="conversation-block" key={c.id}>
                <header><b>{c.canal}</b><span>{c.date}</span><StatutBadge statut={c.mode === "Agent IA" ? "Pris en charge par l'IA" : "Transféré à un conseiller"} /></header>
                <p className="muted-line">{c.resume}</p>
                <div className="chat-thread">
                  {c.messages.map((m, i) => (
                    <div key={`${c.id}-${i}`} className={`chat-bubble ${m.auteur === "Prospect" ? "in" : "out"}`}>
                      <b>{m.auteur}</b><p>{m.texte}</p><small>{m.heure}</small>
                    </div>
                  ))}
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate({ to: "/agent-service-client" })}>Ouvrir dans le service client</Button>
              </div>
            ))}
          </Panel>
        </TabsContent>

        <TabsContent value="suggestions">
          <Panel>
            <PanelTitle title="Critères détectés" subtitle="Extraits automatiquement des conversations" />
            <Chips items={analyse.criteres} />
          </Panel>
          <div className="suggestion-grid">
            {suggestions.filter((s) => !retirees.includes(s.prestation.id)).map(({ prestation, score, pourquoi }) => (
              <Panel className="suggestion-card" key={prestation.id}>
                <img src={prestation.image} alt={prestation.nom} />
                <div className="suggestion-body">
                  <div className="campaign-head"><div><b>{prestation.nom}</b><span>{prestation.ville} · {prestation.categorie} · {prestation.duree}</span></div><span className="score-pill">{score} %</span></div>
                  <b className="price-line">{euro(prestation.prix)} / personne</b>
                  <p><Sparkles />Pourquoi cette suggestion ? {pourquoi}</p>
                  <div className="card-actions">
                    <Button size="sm" onClick={() => notify(`${prestation.nom} présentée à ${nomComplet}.`)}>Présenter au client</Button>
                    <Button size="sm" variant="outline" onClick={() => navigate({ to: "/devis", search: { nouveau: "1" } })}>Ajouter au devis</Button>
                    <Button size="sm" variant="outline" onClick={() => navigate({ to: "/reservations", search: { nouveau: "1" } })}>Créer une réservation</Button>
                    <Button size="sm" variant="outline" onClick={() => { setRetirees((l) => [...l, prestation.id]); notify("Suggestion retirée."); }}>Retirer</Button>
                  </div>
                </div>
              </Panel>
            ))}
            {suggestions.every((s) => retirees.includes(s.prestation.id)) && (
              <Panel><EmptyState titre="Toutes les suggestions ont été traitées." ctaLabel="Réafficher les suggestions" onCta={() => setRetirees([])} icon={Sparkles} /></Panel>
            )}
          </div>
        </TabsContent>

        <TabsContent value="devis">
          {devisLies.length ? devisLies.map((d) => {
            const t = totalDevis(d);
            return (
              <Panel key={d.id}>
                <div className="document-preview">
                  <header><HabtiLogo /><div><b>{d.reference}</b><span>Émis le {dateFr(d.date)} · {d.statut}</span></div></header>
                  <p className="doc-client">Client : <b>{d.client}</b></p>
                  <table className="doc-table">
                    <thead><tr><th>Désignation</th><th>Qté</th><th>P.U.</th><th>Total</th></tr></thead>
                    <tbody>{d.lignes.map((l) => <tr key={l.id}><td>{l.designation}</td><td>{l.quantite}</td><td>{euro(l.prixUnitaire)}</td><td>{euro(l.quantite * l.prixUnitaire)}</td></tr>)}</tbody>
                  </table>
                  <div className="doc-totals">
                    <p><span>Total HT</span><b>{euro(t.ht)}</b></p>
                    <p><span>Remise</span><b>-{euro(t.remise)}</b></p>
                    <p><span>TVA</span><b>{euro(t.tva)}</b></p>
                    <p className="grand"><span>Total TTC</span><b>{euro(t.ttc)}</b></p>
                  </div>
                  <p className="muted-line">Conditions : acompte de 40 % à la réservation, solde 7 jours avant la prestation.</p>
                </div>
                <div className="doc-actions">
                  <Button variant="outline" onClick={() => navigate({ to: "/devis/$id", params: { id: d.id } })}>Voir en plein écran</Button>
                  <Button variant="outline" onClick={() => navigate({ to: "/devis/$id", params: { id: d.id } })}>Modifier</Button>
                  <Button variant="outline" onClick={() => window.print()}>Télécharger</Button>
                  <Button variant="outline" onClick={() => notify(`${d.reference} envoyé au client.`)}><Send />Envoyer</Button>
                  <Button variant="outline" onClick={() => notify(`${d.reference} dupliqué.`)}>Dupliquer</Button>
                </div>
              </Panel>
            );
          }) : (
            <Panel><EmptyState titre="Aucun devis lié à ce prospect." ctaLabel="Créer un devis" onCta={() => navigate({ to: "/devis", search: { nouveau: "1" } })} icon={FileText} /></Panel>
          )}
        </TabsContent>

        <TabsContent value="reservations">
          <Panel>
            <PanelTitle title="Réservations" subtitle="Dossiers opérationnels rattachés" />
            {reservationsLiees.map((r) => (
              <button className="detail-row" key={r.id} onClick={() => navigate({ to: "/reservations/$id", params: { id: r.id } })}>
                <span>{r.reference}</span><b>{r.prestation}</b><small>{dateFr(r.date)} · {r.statut}</small>
              </button>
            ))}
            {!reservationsLiees.length && <EmptyState titre="Aucune réservation liée." ctaLabel="Créer une réservation" onCta={() => navigate({ to: "/reservations", search: { nouveau: "1" } })} icon={CalendarDays} />}
          </Panel>
        </TabsContent>

        <TabsContent value="documents"><DocumentsPanel documents={documents} onNotify={notify} /></TabsContent>

        <TabsContent value="historique">
          <Panel>
            <PanelTitle title="Historique d’activité" subtitle="Chronologie complète du dossier" />
            <form className="note-form" onSubmit={(e) => { e.preventDefault(); if (!note.trim()) return; addProspectNote(prospect.id, note.trim()); setNote(""); notify("Note ajoutée."); }}>
              <TextInput placeholder="Ajouter une note interne…" value={note} onChange={(e) => setNote(e.currentTarget.value)} />
              <Button type="submit" disabled={!note.trim()}>Ajouter</Button>
            </form>
            <div className="mini-timeline">
              {prospect.notes.map((n) => <p key={n.id}><i />{n.texte} <span>{n.date}</span></p>)}
              {prospect.historique.map((h, i) => <p key={`${h.date}-${i}`}><i />{h.texte} <span>{h.date}</span></p>)}
              <p><i />Prospect créé <span>{dateFr(prospect.createdAt)}</span></p>
            </div>
          </Panel>
        </TabsContent>
      </Tabs>

      <FormModal open={edition} onOpenChange={setEdition} title="Modifier le prospect" submitLabel="Enregistrer" wide
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          updateProspect(prospect.id, {
            prenom: String(f.get("prenom")), nom: String(f.get("nom")), telephone: String(f.get("telephone")),
            email: String(f.get("email")), ville: String(f.get("ville")), budget: Number(f.get("budget")),
            personnes: Number(f.get("personnes")), activites: String(f.get("activites")),
            statut: String(f.get("statut")) as Prospect["statut"],
          });
          setEdition(false);
          notify("Prospect mis à jour.");
        }}>
        <Field label="Prénom"><TextInput name="prenom" defaultValue={prospect.prenom} /></Field>
        <Field label="Nom"><TextInput name="nom" defaultValue={prospect.nom} /></Field>
        <Field label="Téléphone"><TextInput name="telephone" defaultValue={prospect.telephone} /></Field>
        <Field label="E-mail"><TextInput name="email" defaultValue={prospect.email} /></Field>
        <Field label="Ville"><TextInput name="ville" defaultValue={prospect.ville} /></Field>
        <Field label="Budget"><TextInput type="number" name="budget" defaultValue={prospect.budget} /></Field>
        <Field label="Personnes"><TextInput type="number" name="personnes" defaultValue={prospect.personnes} /></Field>
        <Field label="Statut"><SelectInput name="statut" options={STATUTS_PROSPECT} defaultValue={prospect.statut} /></Field>
        <Field label="Activités souhaitées" full><TextArea name="activites" defaultValue={prospect.activites} /></Field>
      </FormModal>

      <FormModal open={affectation} onOpenChange={setAffectation} title="Affecter le prospect" submitLabel="Affecter"
        onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); updateProspect(prospect.id, { conseiller: String(f.get("conseiller")) }); setAffectation(false); notify("Prospect affecté."); }}>
        <Field label="Conseiller" full><SelectInput name="conseiller" options={["Salma Bennani", "Karim Naji", "Imane Tazi", "Hafsa Idrissi"]} defaultValue={prospect.conseiller} /></Field>
      </FormModal>

      <ConfirmDialog open={convertir} onOpenChange={setConvertir} titre="Convertir ce prospect en client ?"
        description="Une fiche client sera créée et le prospect passera au statut Client." confirmLabel="Convertir"
        onConfirm={() => {
          addClient({ id: newId("C"), nom: nomComplet, ville: prospect.ville, email: prospect.email, telephone: prospect.telephone, segment: "Particulier", reservations: 0, chiffreAffaires: 0, depuis: "2026" });
          updateProspect(prospect.id, { statut: "Client" });
          setConvertir(false);
          notify("Prospect converti en client.");
        }} />
    </div>
  );
}

/* ============================ CLIENT ============================ */

export function ClientDetailView({ id }: { id: string }) {
  const navigate = useNavigate();
  const { clients, reservations, devis, factures, paiements, tickets, prestations, notify } = useHabti();
  const client = clients.find((c) => c.id === id);
  const analyse = useMemo(() => (client ? clientAnalyse(client) : null), [client]);
  if (!client || !analyse) return <NotFoundEntity titre="Client introuvable" retour="/clients" />;

  const rReservations = reservations.filter((r) => r.client === client.nom);
  const rDevis = devis.filter((d) => d.client === client.nom);
  const rFactures = factures.filter((f) => f.client === client.nom);
  const rPaiements = paiements.filter((p) => p.client === client.nom);
  const rTickets = tickets.filter((t) => t.client === client.nom);
  const documents = [
    { id: `${client.id}-d1`, nom: `Contrat cadre ${client.nom}.pdf`, type: "PDF", date: "12/09/2026", taille: "240 Ko", statut: "Validé" },
    { id: `${client.id}-d2`, nom: "Conditions générales HABTI.pdf", type: "PDF", date: "01/09/2026", taille: "96 Ko", statut: "Partagé" },
  ];

  return (
    <div className="module-stack detail-page">
      <Breadcrumb to="/clients" parent="Clients" courant={client.nom} />
      <div className="detail-hero">
        <Button variant="ghost" onClick={() => navigate({ to: "/clients" })}><ArrowLeft />Retour aux clients</Button>
        <div className="detail-hero-main">
          <Avatar><AvatarFallback>{client.nom.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
          <div><h2>{client.nom}</h2><p>{client.segment} · {client.ville} · client depuis {client.depuis}</p></div>
        </div>
        <div className="detail-actions">
          <Button variant="outline" onClick={() => notify(`Message envoyé à ${client.email} (démonstration).`)}>Contacter</Button>
          <Button variant="outline" onClick={() => navigate({ to: "/devis", search: { nouveau: "1" } })}>Créer un devis</Button>
          <Button onClick={() => navigate({ to: "/reservations", search: { nouveau: "1" } })}>Nouvelle réservation</Button>
        </div>
      </div>

      <section className="metrics-grid metrics-4">
        <Metric label="Chiffre d'affaires" value={euro(client.chiffreAffaires)} icon={Wallet} tone="gold" />
        <Metric label="Réservations" value={String(client.reservations)} icon={CalendarDays} />
        <Metric label="Panier moyen" value={euro(analyse.panierMoyen)} icon={CreditCard} />
        <Metric label="Dernière interaction" value={analyse.derniere} icon={Clock3} />
      </section>

      <Tabs defaultValue="apercu" className="detail-tabs">
        <TabsList>
          <TabsTrigger value="apercu">Vue d’ensemble</TabsTrigger>
          <TabsTrigger value="reservations">Réservations</TabsTrigger>
          <TabsTrigger value="activites">Activités & Voyages</TabsTrigger>
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="devis">Devis</TabsTrigger>
          <TabsTrigger value="paiements">Paiements</TabsTrigger>
          <TabsTrigger value="factures">Factures</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="apercu">
          <div className="detail-columns">
            <Panel>
              <PanelTitle title="Informations" subtitle="Coordonnées et préférences" />
              <div className="data-grid">
                <div><span>E-mail</span><b>{client.email}</b></div>
                <div><span>Téléphone</span><b>{client.telephone}</b></div>
                <div><span>Ville</span><b>{client.ville}</b></div>
                <div><span>Segment</span><b>{client.segment}</b></div>
                <div><span>Budget moyen</span><b>{euro(analyse.panierMoyen)}</b></div>
                <div><span>Villes favorites</span><b>{analyse.villes.join(", ")}</b></div>
                <div><span>Total réservations</span><b>{client.reservations}</b></div>
                <div><span>Revenu total</span><b>{euro(client.chiffreAffaires)}</b></div>
              </div>
            </Panel>
            <Panel className="ai-card">
              <PanelTitle title="Analyse client IA" subtitle="Lecture de la relation et prochaine proposition" />
              <div className="data-grid">
                <div><span>Expériences préférées</span><b>{analyse.experiences.join(", ")}</b></div>
                <div><span>Fréquence d’achat</span><b>{analyse.frequence}</b></div>
              </div>
              <span className="field-label">Niveau d’engagement</span>
              <Progress value={analyse.engagement} />
              <div className="next-action">
                <div><Sparkles /><b>Prochaine activité suggérée</b></div>
                <p>{analyse.prochaine}</p>
                <Button onClick={() => { notify(`${analyse.prochaine} proposée à ${client.nom}.`); }}>Présenter au client</Button>
              </div>
            </Panel>
          </div>
        </TabsContent>

        <TabsContent value="reservations">
          <Panel>
            <PanelTitle title="Réservations liées" subtitle="Historique opérationnel du compte" />
            {rReservations.map((r) => (
              <button className="detail-row" key={r.id} onClick={() => navigate({ to: "/reservations/$id", params: { id: r.id } })}>
                <span>{r.reference}</span><b>{r.prestation}</b><small>{dateFr(r.date)} · {r.statut}</small>
              </button>
            ))}
            {!rReservations.length && <EmptyState titre="Aucune réservation liée." ctaLabel="Créer une réservation" onCta={() => navigate({ to: "/reservations", search: { nouveau: "1" } })} icon={CalendarDays} />}
          </Panel>
        </TabsContent>

        <TabsContent value="activites">
          <Panel>
            <PanelTitle title="Activités & voyages" subtitle="Expériences déjà vécues et recommandations" />
            <div className="suggestion-grid">
              {prestations.filter((p) => analyse.villes.includes(p.ville)).slice(0, 3).map((p) => (
                <Panel className="suggestion-card" key={p.id}>
                  <img src={p.image} alt={p.nom} />
                  <div className="suggestion-body">
                    <b>{p.nom}</b><span>{p.ville} · {p.duree}</span><b className="price-line">{euro(p.prix)}</b>
                    <div className="card-actions">
                      <Button size="sm" onClick={() => navigate({ to: "/reservations", search: { nouveau: "1" } })}>Réserver</Button>
                      <Button size="sm" variant="outline" onClick={() => navigate({ to: "/catalogue" })}>Voir au catalogue</Button>
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="conversations">
          <Panel>
            <PanelTitle title="Conversations" subtitle="Contexte relationnel et suivi humain" />
            {rTickets.map((t) => (
              <button className="detail-row" key={t.id} onClick={() => navigate({ to: "/agent-service-client", search: { id: t.id } })}>
                <span>{t.canal}</span><b>{t.sujet}</b><small>{t.statut}</small>
              </button>
            ))}
            {!rTickets.length && <p className="muted-line">Aucune conversation enregistrée.</p>}
            <div className="drawer-actions"><Button variant="outline" onClick={() => navigate({ to: "/agent-service-client" })}>Ouvrir le service client</Button></div>
          </Panel>
        </TabsContent>

        <TabsContent value="devis">
          <Panel>
            <PanelTitle title="Devis" subtitle="Propositions commerciales du compte" />
            {rDevis.map((d) => (
              <button className="detail-row" key={d.id} onClick={() => navigate({ to: "/devis/$id", params: { id: d.id } })}>
                <span>{d.reference}</span><b>{euro(totalDevis(d).ttc)}</b><small>{d.statut}</small>
              </button>
            ))}
            {!rDevis.length && <EmptyState titre="Aucun devis." ctaLabel="Créer un devis" onCta={() => navigate({ to: "/devis", search: { nouveau: "1" } })} icon={FileText} />}
          </Panel>
        </TabsContent>

        <TabsContent value="paiements">
          <Panel>
            <PanelTitle title="Paiements" subtitle="Acomptes, soldes et encaissements" />
            {rPaiements.map((p) => (
              <button className="detail-row" key={p.id} onClick={() => navigate({ to: "/paiements" })}>
                <span>{p.reference}</span><b>{euro(p.montantPaye)} / {euro(p.montantTotal)}</b><small>{p.statut}</small>
              </button>
            ))}
            {!rPaiements.length && <p className="muted-line">Aucun paiement enregistré.</p>}
          </Panel>
        </TabsContent>

        <TabsContent value="factures">
          <Panel>
            <PanelTitle title="Factures" subtitle="Documents comptables émis" />
            {rFactures.map((f) => (
              <button className="detail-row" key={f.id} onClick={() => navigate({ to: "/factures" })}>
                <span>{f.reference}</span><b>{euro(f.montant)}</b><small>{f.statut}</small>
              </button>
            ))}
            {!rFactures.length && <p className="muted-line">Aucune facture émise.</p>}
          </Panel>
        </TabsContent>

        <TabsContent value="documents"><DocumentsPanel documents={documents} onNotify={notify} /></TabsContent>

        <TabsContent value="historique">
          <Panel>
            <PanelTitle title="Historique" subtitle="Chronologie de la relation client" />
            <div className="mini-timeline">
              <p><i />Dernier échange service client <span>{analyse.derniere}</span></p>
              {rReservations.map((r) => <p key={r.id}><i />Réservation {r.reference} — {r.statut} <span>{dateFr(r.date)}</span></p>)}
              {rFactures.map((f) => <p key={f.id}><i />Facture {f.reference} — {f.statut} <span>{dateFr(f.date)}</span></p>)}
              <p><i />Client créé <span>{client.depuis}</span></p>
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ============================ OPÉRATION ============================ */

export function OperationDetailView({ id }: { id: string }) {
  const navigate = useNavigate();
  const { missions, reservations, paiements, employes, updateMission, toggleChecklist, notify } = useHabti();
  const mission = missions.find((m) => m.id === id);
  const [note, setNote] = useState("");
  const [approvals, setApprovals] = useState(["Confirmer chauffeur de secours", "Envoyer brief final au client", "Prévenir l'équipe restauration"]);
  if (!mission) return <NotFoundEntity titre="Opération introuvable" retour="/operations" />;

  const reservation = reservations.find((r) => r.client === mission.client || r.prestation === mission.activite);
  const paiement = paiements.find((p) => p.client === mission.client || p.rattachement === reservation?.reference);
  const done = mission.checklist.filter((c) => c.fait).length;
  const restantes = mission.checklist.length - done;
  const progress = Math.round((done / (mission.checklist.length || 1)) * 100);
  const ca = reservation?.tarif ?? 0;
  const paye = paiement?.montantPaye ?? 0;
  const jours = Math.max(0, Math.round((new Date(mission.date).getTime() - new Date("2026-09-18").getTime()) / 86400000));
  const readiness = Math.min(99, Math.round(progress * 0.5 + (mission.employes.length ? 25 : 0) + (paye > 0 ? 25 : 5)));
  const documents = [
    { id: `${mission.id}-d1`, nom: `Brief terrain ${mission.titre}.pdf`, type: "PDF", date: dateFr(mission.date), taille: "180 Ko", statut: "Validé" },
    { id: `${mission.id}-d2`, nom: "Feuille de route équipe.pdf", type: "PDF", date: dateFr(mission.date), taille: "120 Ko", statut: "Partagé" },
  ];

  return (
    <div className="module-stack detail-page">
      <Breadcrumb to="/operations" parent="Opérations" courant={mission.titre} />
      <div className="detail-hero">
        <Button variant="ghost" onClick={() => navigate({ to: "/operations" })}><ArrowLeft />Retour aux opérations</Button>
        <div className="detail-hero-main">
          <div className="detail-icon"><CheckCircle2 /></div>
          <div><h2>{mission.titre}</h2><p>{mission.client} · {mission.lieu} · {dateFr(mission.date)} à {mission.heure}</p></div>
          <StatutBadge statut={mission.statut} />
        </div>
        <div className="detail-actions">
          <Button variant="outline" onClick={() => { updateMission(mission.id, { statut: "En cours" }); notify("Opération démarrée."); }}>Démarrer</Button>
          <Button variant="outline" onClick={() => navigate({ to: "/planning" })}>Voir le planning</Button>
          <Button onClick={() => { updateMission(mission.id, { statut: "Terminée" }); notify("Opération terminée."); }}>Terminer</Button>
        </div>
      </div>

      <section className="metrics-grid metrics-4">
        <Metric label="Participants" value={String(reservation?.participants ?? 0)} icon={Users} />
        <Metric label="Chiffre d'affaires" value={euro(ca)} icon={Wallet} tone="gold" />
        <Metric label="Budget engagé" value={euro(Math.round(ca * 0.62))} icon={CreditCard} />
        <Metric label="Montant payé" value={euro(paye)} icon={CreditCard} />
        <Metric label="Reste à encaisser" value={euro(Math.max(0, ca - paye))} icon={Wallet} />
        <Metric label="Employés affectés" value={String(mission.employes.length)} icon={Users} />
        <Metric label="Tâches réalisées" value={`${done}/${mission.checklist.length}`} icon={CheckCircle2} />
        <Metric label="Jours restants" value={String(jours)} icon={Clock3} tone="gold" />
      </section>

      <Panel>
        <PanelTitle title="Score de préparation opérationnelle" subtitle="Tâches, équipe et encaissement combinés" />
        <div className="readiness"><b>{readiness}%</b><Progress value={readiness} /><span>{restantes} tâche(s) restante(s)</span></div>
      </Panel>

      <Tabs defaultValue="apercu" className="detail-tabs">
        <TabsList>
          <TabsTrigger value="apercu">Vue d’ensemble</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="equipe">Équipe</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="logistique">Logistique</TabsTrigger>
          <TabsTrigger value="taches">Tâches</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="ia">Suggestions IA</TabsTrigger>
          <TabsTrigger value="analyse">Analyse IA</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="apercu">
          <Panel>
            <PanelTitle title="Brief terrain" subtitle="Informations partagées à l’équipe" />
            <div className="data-grid">
              <div><span>Client</span><b>{mission.client}</b></div>
              <div><span>Activité</span><b>{mission.activite}</b></div>
              <div><span>Lieu</span><b>{mission.lieu}</b></div>
              <div><span>Date</span><b>{dateFr(mission.date)} à {mission.heure}</b></div>
              <div><span>Équipe</span><b>{mission.employes.join(", ") || "Non affectée"}</b></div>
              <div><span>Réservation</span><b>{reservation?.reference ?? "À créer"}</b></div>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="planning">
          <Panel>
            <PanelTitle title="Déroulé de l’opération" subtitle="Étapes horaires prévues sur le terrain" />
            <div className="mini-timeline">
              <p><i />{mission.heure} — Accueil et briefing équipe <span>{dateFr(mission.date)}</span></p>
              <p><i />Installation et vérification logistique <span>{dateFr(mission.date)}</span></p>
              <p><i />Déroulé de l’expérience client <span>{dateFr(mission.date)}</span></p>
              <p><i />Débrief et rangement <span>{dateFr(mission.date)}</span></p>
            </div>
            <div className="drawer-actions"><Button variant="outline" onClick={() => navigate({ to: "/planning" })}>Ouvrir le planning global</Button></div>
          </Panel>
        </TabsContent>

        <TabsContent value="equipe">
          <Panel>
            <PanelTitle title="Équipe affectée" subtitle="Disponibilités et charges de travail" />
            {employes.filter((e) => mission.employes.includes(e.nom)).map((e) => (
              <button className="detail-row" key={e.id} onClick={() => navigate({ to: "/employes/$id", params: { id: e.id } })}>
                <span>{e.initiales}</span><b>{e.nom}</b><small>{e.role} · {e.disponibilite}</small>
              </button>
            ))}
            {!mission.employes.length && <p className="muted-line">Aucun employé affecté.</p>}
            <div className="drawer-actions">
              <Button variant="outline" onClick={() => navigate({ to: "/employes" })}>Affecter un employé</Button>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="participants">
          <Panel>
            <PanelTitle title="Participants" subtitle="Effectif attendu sur l’opération" />
            <div className="data-grid">
              <div><span>Participants</span><b>{reservation?.participants ?? 0}</b></div>
              <div><span>Client</span><b>{mission.client}</b></div>
              <div><span>Notes participants</span><b>{reservation?.notes ?? "Aucune note"}</b></div>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="logistique">
          <Panel>
            <PanelTitle title="Logistique" subtitle="Transport, matériel et prestataires" />
            <div className="data-grid">
              <div><span>Transport</span><b>2 véhicules 4x4 + navette</b></div>
              <div><span>Matériel</span><b>Sonorisation, tentes, éclairage</b></div>
              <div><span>Restauration</span><b>Traiteur partenaire confirmé</b></div>
              <div><span>Lieu</span><b>{mission.lieu}</b></div>
            </div>
            <div className="drawer-actions"><Button variant="outline" onClick={() => notify("Check-list logistique envoyée à l’équipe.")}>Envoyer la check-list</Button></div>
          </Panel>
        </TabsContent>

        <TabsContent value="taches">
          <Panel>
            <PanelTitle title="Checklist opérationnelle" subtitle="Chaque validation met à jour l’avancement" />
            <Progress value={progress} />
            <div className="checklist">
              {mission.checklist.map((c) => (
                <label key={c.id}>
                  <input type="checkbox" checked={c.fait} onChange={() => { toggleChecklist(mission.id, c.id); notify(c.fait ? "Étape rouverte." : "Étape validée."); }} />
                  <span className={c.fait ? "done" : ""}>{c.label}</span>
                </label>
              ))}
            </div>
            <form className="note-form" onSubmit={(e) => {
              e.preventDefault();
              if (!note.trim()) return;
              updateMission(mission.id, { checklist: [...mission.checklist, { id: newId("c"), label: note.trim(), fait: false }] });
              setNote("");
              notify("Tâche ajoutée.");
            }}>
              <TextInput value={note} onChange={(e) => setNote(e.currentTarget.value)} placeholder="Ajouter une tâche…" />
              <Button disabled={!note.trim()}>Ajouter</Button>
            </form>
          </Panel>
        </TabsContent>

        <TabsContent value="finance">
          <Panel>
            <PanelTitle title="Finance associée" subtitle="Suivi du règlement de l’opération" />
            <div className="data-grid">
              <div><span>Réservation</span><b>{reservation?.reference ?? "—"}</b></div>
              <div><span>Montant</span><b>{euro(ca)}</b></div>
              <div><span>Statut paiement</span><b>{paiement?.statut ?? "Non rapproché"}</b></div>
              <div><span>Payé</span><b>{euro(paye)}</b></div>
            </div>
            <div className="drawer-actions">
              <Button variant="outline" onClick={() => navigate({ to: "/paiements" })}>Voir les paiements</Button>
              <Button variant="outline" onClick={() => navigate({ to: "/factures" })}>Voir les factures</Button>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="ia">
          <Panel>
            <PanelTitle title="Suggestions IA à valider" subtitle="Aucune action automatique sans validation humaine" />
            {approvals.map((a) => (
              <div className="approval-row" key={a}>
                <Sparkles /><span>{a}</span>
                <Button size="sm" onClick={() => { setApprovals((l) => l.filter((x) => x !== a)); notify("Suggestion approuvée."); }}>Approuver</Button>
                <Button size="sm" variant="outline" onClick={() => { setApprovals((l) => l.filter((x) => x !== a)); notify("Suggestion refusée."); }}>Refuser</Button>
              </div>
            ))}
            {!approvals.length && <EmptyState titre="Toutes les suggestions ont été traitées." ctaLabel="Générer de nouvelles suggestions" onCta={() => { setApprovals(["Prévoir une marge de 30 minutes sur le transport", "Confirmer le second guide"]); notify("Nouvelles suggestions générées."); }} icon={Sparkles} />}
          </Panel>
        </TabsContent>

        <TabsContent value="analyse">
          <Panel>
            <PanelTitle title="Analyse IA de l’opération" subtitle="Risques et niveau de préparation" />
            <div className="radial-grid">
              <Radial label="Préparation" valeur={readiness} />
              <Radial label="Avancement tâches" valeur={progress} />
              <Radial label="Couverture équipe" valeur={Math.min(99, mission.employes.length * 45 + 10)} />
              <Radial label="Sécurisation financière" valeur={ca ? Math.round((paye / ca) * 100) : 0} />
            </div>
            <p className="summary-text">
              L’opération « {mission.titre} » est {readiness > 70 ? "bien engagée" : "à sécuriser"} : {restantes} tâche(s) restante(s),
              {mission.employes.length ? ` ${mission.employes.length} employé(s) affecté(s)` : " aucune équipe affectée"} et {euro(Math.max(0, ca - paye))} restant à encaisser.
            </p>
          </Panel>
        </TabsContent>

        <TabsContent value="documents"><DocumentsPanel documents={documents} onNotify={notify} /></TabsContent>

        <TabsContent value="historique">
          <Panel>
            <PanelTitle title="Historique de l’opération" subtitle="Notes terrain et changements de statut" />
            <div className="mini-timeline">
              {mission.notes.map((n) => <p key={n.id}><i />{n.texte} <span>{n.date}</span></p>)}
              <p><i />Statut actuel : {mission.statut} <span>{dateFr(mission.date)}</span></p>
              <p><i />Opération créée <span>{dateFr(mission.date)}</span></p>
            </div>
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ============================ RÉSERVATION ============================ */

export function ReservationDetailView({ id }: { id: string }) {
  const navigate = useNavigate();
  const { reservations, updateReservation, addMission, notify } = useHabti();
  const r = reservations.find((x) => x.id === id);
  if (!r) return <NotFoundEntity titre="Réservation introuvable" retour="/reservations" />;
  const confirmer = () => {
    updateReservation(r.id, { statut: "Confirmée" });
    addMission({
      id: newId("M"), titre: `Préparation ${r.prestation}`, client: r.client, activite: r.prestation, date: r.date, heure: r.heure,
      lieu: r.ville, employes: r.employe ? [r.employe] : [], statut: "Planifiée",
      checklist: [{ id: newId("c"), label: "Confirmer la logistique transport", fait: false }, { id: newId("c"), label: "Briefer l'équipe terrain", fait: false }], notes: [],
    });
    notify("Réservation confirmée. Opération créée.");
  };
  return (
    <div className="module-stack detail-page">
      <Breadcrumb to="/reservations" parent="Réservations" courant={r.reference} />
      <div className="detail-hero">
        <Button variant="ghost" onClick={() => navigate({ to: "/reservations" })}><ArrowLeft />Retour aux réservations</Button>
        <div className="detail-hero-main">
          <div className="detail-icon"><CalendarDays /></div>
          <div><h2>{r.prestation}</h2><p>{r.reference} · {r.client}</p></div>
          <StatutBadge statut={r.statut} />
        </div>
        <div className="detail-actions">
          <Button variant="outline" onClick={() => { updateReservation(r.id, { statut: "En cours" }); notify("Réservation démarrée."); }}>Démarrer</Button>
          <Button onClick={confirmer}>Confirmer</Button>
        </div>
      </div>
      <section className="metrics-grid metrics-4">
        <Metric label="Date" value={dateFr(r.date)} icon={CalendarDays} />
        <Metric label="Participants" value={String(r.participants)} icon={Users} />
        <Metric label="Tarif" value={euro(r.tarif)} icon={Wallet} tone="gold" />
        <Metric label="Ville" value={r.ville} icon={MapPin} />
      </section>
      <Panel>
        <PanelTitle title="Détails de réservation" subtitle="Logistique, notes et prochaines étapes" />
        <div className="data-grid">
          <div><span>Horaire</span><b>{r.heure}</b></div>
          <div><span>Responsable</span><b>{r.employe || "Non affecté"}</b></div>
          <div><span>Notes</span><b>{r.notes || "Aucune note"}</b></div>
          <div><span>Statut</span><b>{r.statut}</b></div>
        </div>
        <div className="drawer-actions">
          <Button variant="outline" onClick={() => navigate({ to: "/devis", search: { nouveau: "1" } })}>Créer un devis</Button>
          <Button variant="outline" onClick={() => navigate({ to: "/operations" })}>Voir les opérations</Button>
          <Button variant="outline" onClick={() => { updateReservation(r.id, { statut: "Annulée" }); notify("Réservation annulée."); }}>Annuler</Button>
        </div>
      </Panel>
    </div>
  );
}

/* ============================ EMPLOYÉ ============================ */

export function EmployeDetailView({ id }: { id: string }) {
  const navigate = useNavigate();
  const { employes, missions, updateEmploye, notify } = useHabti();
  const e = employes.find((x) => x.id === id);
  if (!e) return <NotFoundEntity titre="Employé introuvable" retour="/employes" />;
  const mine = missions.filter((m) => m.employes.includes(e.nom));
  return (
    <div className="module-stack detail-page">
      <Breadcrumb to="/employes" parent="Employés" courant={e.nom} />
      <div className="detail-hero">
        <Button variant="ghost" onClick={() => navigate({ to: "/employes" })}><ArrowLeft />Retour aux employés</Button>
        <div className="detail-hero-main">
          <Avatar><AvatarFallback>{e.initiales}</AvatarFallback></Avatar>
          <div><h2>{e.nom}</h2><p>{e.role} · {e.ville}</p></div>
          <StatutBadge statut={e.disponibilite} />
        </div>
        <div className="detail-actions">
          <Button variant="outline" onClick={() => { updateEmploye(e.id, { disponibilite: "Disponible" }); notify("Disponibilité mise à jour."); }}>Marquer disponible</Button>
          <Button onClick={() => navigate({ to: "/operations", search: { nouveau: "1" } })}>Affecter</Button>
        </div>
      </div>
      <section className="metrics-grid metrics-3">
        <Metric label="Missions" value={String(e.missions)} icon={CheckCircle2} />
        <Metric label="Charge" value={`${e.charge}%`} icon={Clock3} tone="gold" />
        <Metric label="Spécialités" value={String(e.specialites.length)} icon={BadgeCheck} />
      </section>
      <Panel>
        <PanelTitle title="Profil opérationnel" subtitle="Compétences, planning et affectations" />
        <div className="data-grid">
          <div><span>Ville</span><b>{e.ville}</b></div>
          <div><span>Disponibilité</span><b>{e.disponibilite}</b></div>
          <div><span>Spécialités</span><b>{e.specialites.join(", ")}</b></div>
          <div><span>Charge</span><b>{e.charge}%</b></div>
        </div>
        <h4 className="block-title">Missions liées</h4>
        {mine.map((m) => (
          <button className="detail-row" key={m.id} onClick={() => navigate({ to: "/operations/$id", params: { id: m.id } })}>
            <span>{dateFr(m.date)}</span><b>{m.titre}</b><small>{m.statut}</small>
          </button>
        ))}
        {!mine.length && <p className="muted-line">Aucune mission affectée.</p>}
      </Panel>
    </div>
  );
}

/* ============================ DEVIS ============================ */

export function DevisDetailView({ id }: { id: string }) {
  const navigate = useNavigate();
  const { devis, updateDevis, addFacture, notify } = useHabti();
  const d = devis.find((x) => x.id === id);
  if (!d) return <NotFoundEntity titre="Devis introuvable" retour="/devis" />;
  const totals = totalDevis(d);
  const accepter = () => {
    updateDevis(d.id, { statut: "Accepté" });
    addFacture({ id: newId("F"), reference: `FA-2026-${Math.floor(Math.random() * 900 + 100)}`, client: d.client, montant: totals.ttc, date: new Date().toISOString().slice(0, 10), echeance: d.validite, statut: "Non payé", origine: d.reference });
    notify("Devis accepté. Facture générée.");
  };
  return (
    <div className="module-stack detail-page">
      <Breadcrumb to="/devis" parent="Devis" courant={d.reference} />
      <div className="detail-hero">
        <Button variant="ghost" onClick={() => navigate({ to: "/devis" })}><ArrowLeft />Retour aux devis</Button>
        <div className="detail-hero-main">
          <div className="detail-icon"><FileText /></div>
          <div><h2>{d.reference}</h2><p>{d.client} · valable jusqu'au {dateFr(d.validite)}</p></div>
          <StatutBadge statut={d.statut} />
        </div>
        <div className="detail-actions">
          <Button variant="outline" onClick={() => { updateDevis(d.id, { statut: "Envoyé" }); notify("Devis envoyé."); }}><Send />Envoyer</Button>
          <Button onClick={accepter}>Accepter</Button>
        </div>
      </div>
      <Panel>
        <div className="document-preview">
          <header><HabtiLogo /><div><b>{d.reference}</b><span>Émis le {dateFr(d.date)}</span></div></header>
          <p className="doc-client">Client : <b>{d.client}</b></p>
          <table className="doc-table">
            <thead><tr><th>Désignation</th><th>Qté</th><th>P.U.</th><th>Total</th></tr></thead>
            <tbody>{d.lignes.map((l) => <tr key={l.id}><td>{l.designation}</td><td>{l.quantite}</td><td>{euro(l.prixUnitaire)}</td><td>{euro(l.quantite * l.prixUnitaire)}</td></tr>)}</tbody>
          </table>
          <div className="doc-totals">
            <p><span>Total HT</span><b>{euro(totals.ht)}</b></p>
            <p><span>Remise</span><b>-{euro(totals.remise)}</b></p>
            <p><span>TVA</span><b>{euro(totals.tva)}</b></p>
            <p className="grand"><span>Total TTC</span><b>{euro(totals.ttc)}</b></p>
          </div>
        </div>
        <div className="doc-actions">
          <Button variant="outline" onClick={() => window.print()}>Télécharger le PDF</Button>
          <Button variant="outline" onClick={() => { updateDevis(d.id, { statut: "Refusé" }); notify("Devis refusé."); }}>Refuser</Button>
          <Button variant="outline" onClick={() => navigate({ to: "/factures" })}>Voir les factures</Button>
        </div>
      </Panel>
    </div>
  );
}

/* ============================ CAMPAGNE ============================ */

export function CampagneDetailView({ id }: { id: string }) {
  const navigate = useNavigate();
  const { campagnes, updateCampagne, notify } = useHabti();
  const c = campagnes.find((x) => x.id === id);
  if (!c) return <NotFoundEntity titre="Campagne introuvable" retour="/campagnes" />;
  return (
    <div className="module-stack detail-page">
      <Breadcrumb to="/campagnes" parent="Campagnes" courant={c.nom} />
      <div className="detail-hero">
        <Button variant="ghost" onClick={() => navigate({ to: "/campagnes" })}><ArrowLeft />Retour aux campagnes</Button>
        <div className="detail-hero-main">
          <div className="detail-icon"><Megaphone /></div>
          <div><h2>{c.nom}</h2><p>{c.canal} · {c.audience} · {dateFr(c.date)}</p></div>
          <StatutBadge statut={c.statut} />
        </div>
        <div className="detail-actions">
          <Button variant="outline" onClick={() => { updateCampagne(c.id, { statut: "Programmée" }); notify("Campagne programmée."); }}>Programmer</Button>
          <Button onClick={() => { updateCampagne(c.id, { statut: "En cours", ouverture: Math.max(c.ouverture, 12), lecture: Math.max(c.lecture, 8) }); notify("Campagne lancée."); }}><Send />Lancer</Button>
        </div>
      </div>
      <section className="metrics-grid metrics-4">
        <Metric label="Destinataires" value={String(c.destinataires)} icon={Users} />
        <Metric label="Ouverture" value={`${c.ouverture}%`} icon={BadgeCheck} />
        <Metric label="Lecture" value={`${c.lecture}%`} icon={Clock3} />
        <Metric label="Canal" value={c.canal} icon={Megaphone} tone="gold" />
      </section>
      <Panel>
        <PanelTitle title="Message de campagne" subtitle="Aperçu envoyé à l'audience" />
        <div className="campaign-message"><b>{c.nom}</b><p>{c.message}</p><Button onClick={() => notify(`Aperçu ${c.canal} envoyé à Salma.`)}>{c.cta}</Button></div>
        <div className="drawer-actions">
          <Button variant="outline" onClick={() => { updateCampagne(c.id, { statut: "Terminée" }); notify("Campagne clôturée."); }}>Clôturer</Button>
          <Button variant="outline" onClick={() => navigate({ to: "/prospects" })}>Voir les prospects</Button>
        </div>
      </Panel>
    </div>
  );
}
