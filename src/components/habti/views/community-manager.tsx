import { useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Facebook, Instagram, Lightbulb,
  Minus, Music2, Plug, Plus, RefreshCw, Search, Send, Settings2, Sparkles, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ActiveChips, ConfirmDialog, EmptyState, Field, FilterSelect, FormModal, Metric, Panel, PanelTitle,
  RowMenu, SelectInput, StatutBadge, TextArea, TextInput,
} from "@/components/habti/ui-bits";
import { useHabti } from "@/lib/habti-store";
import { postHistorique, postSuggestions } from "@/lib/habti-insights";
import {
  JOURS_SEMAINE, LANGUES, PLATEFORMES_SOCIALES, STATUTS_PUBLICATION, TONS_EDITORIAUX, TYPES_CONTENU, TYPES_CTA,
  dateFr, newId, type SocialPost, type StatutPublication,
} from "@/lib/habti-data";

const RESEAU_ICON: Record<string, typeof Facebook> = { Facebook, Instagram, TikTok: Music2 };

export function CmSubnav() {
  return (
    <nav className="cm-subnav" aria-label="Sous-navigation Community Manager">
      <Link to="/community-manager/idees" activeProps={{ className: "active" }}><Lightbulb />Idées</Link>
      <Link to="/community-manager/planning" activeProps={{ className: "active" }}><CalendarDays />Planning</Link>
      <Link to="/community-manager/parametres" activeProps={{ className: "active" }}><Settings2 />Paramètres de l’agent</Link>
    </nav>
  );
}

/* ============================ IDÉES ============================ */

export function IdeesView() {
  const navigate = useNavigate();
  const { socialPosts, campagnes, addSocialPost, updateSocialPost, removeSocialPost, notify } = useHabti();
  const [q, setQ] = useState("");
  const [plateforme, setPlateforme] = useState("Tous");
  const [type, setType] = useState("Tous");
  const [campagne, setCampagne] = useState("Tous");
  const [statut, setStatut] = useState("Tous");
  const [date, setDate] = useState("");
  const [theme, setTheme] = useState("");
  const [creation, setCreation] = useState(false);
  const [edition, setEdition] = useState<SocialPost | null>(null);
  const [suppression, setSuppression] = useState<SocialPost | null>(null);
  const [idee, setIdee] = useState("séjour premium à Marrakech");

  const liste = useMemo(() => socialPosts.filter((p) => {
    if (q && !`${p.titre} ${p.legende} ${p.hashtags} ${p.theme}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (plateforme !== "Tous" && !p.plateformes.includes(plateforme)) return false;
    if (type !== "Tous" && p.type !== type) return false;
    if (campagne !== "Tous" && p.campagne !== campagne) return false;
    if (statut !== "Tous" && p.statut !== statut) return false;
    if (date && p.date !== date) return false;
    if (theme && !p.theme.toLowerCase().includes(theme.toLowerCase())) return false;
    return true;
  }), [socialPosts, q, plateforme, type, campagne, statut, date, theme]);

  const chips = [
    q && { label: "Recherche", value: q },
    plateforme !== "Tous" && { label: "Plateforme", value: plateforme },
    type !== "Tous" && { label: "Type", value: type },
    campagne !== "Tous" && { label: "Campagne", value: campagne },
    statut !== "Tous" && { label: "Statut", value: statut },
    date && { label: "Date", value: dateFr(date) },
    theme && { label: "Thématique", value: theme },
  ].filter(Boolean) as { label: string; value: string }[];

  const reset = () => { setQ(""); setPlateforme("Tous"); setType("Tous"); setCampagne("Tous"); setStatut("Tous"); setDate(""); setTheme(""); };
  const removeChip = (l: string) => {
    if (l === "Recherche") setQ("");
    if (l === "Plateforme") setPlateforme("Tous");
    if (l === "Type") setType("Tous");
    if (l === "Campagne") setCampagne("Tous");
    if (l === "Statut") setStatut("Tous");
    if (l === "Date") setDate("");
    if (l === "Thématique") setTheme("");
  };

  const generer = () => {
    const base = idee.trim() || "expérience HABTI";
    const id = newId("POST");
    addSocialPost({
      id, titre: `Idée IA — ${base}`,
      legende: `Découvrez ${base} avec une sélection HABTI pensée pour voyager avec confort, authenticité et accompagnement humain.`,
      hashtags: "#HabtiVoyage #Maroc #ExperiencePremium", plateformes: ["Instagram"], type: "Carrousel", theme: "Destination",
      date: new Date().toISOString().slice(0, 10), heure: "18:00", statut: "Brouillon", origine: "IA",
      image: socialPosts[0]?.image ?? "", campagne: campagnes[0]?.nom ?? "Sans campagne",
      cta: "Demander un devis", format: "Carrousel 5 slides",
    });
    notify("Nouvelle idée générée par l’agent.");
    navigate({ to: "/community-manager/idees/$id", params: { id } });
  };

  const soumettre = (e: React.FormEvent<HTMLFormElement>, existant?: SocialPost | null) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const base = {
      titre: String(f.get("titre")), legende: String(f.get("legende")), hashtags: String(f.get("hashtags")),
      plateformes: [String(f.get("plateforme"))], type: String(f.get("type")), theme: String(f.get("theme")),
      date: String(f.get("date")), heure: String(f.get("heure")), statut: String(f.get("statut")) as StatutPublication,
      campagne: String(f.get("campagne")), cta: String(f.get("cta")), format: String(f.get("format")),
    };
    if (existant) { updateSocialPost(existant.id, base); setEdition(null); notify("Publication mise à jour."); return; }
    const id = newId("POST");
    addSocialPost({ ...base, id, origine: "Manuel", image: socialPosts[0]?.image ?? "" });
    setCreation(false);
    notify("Publication créée.");
    navigate({ to: "/community-manager/idees/$id", params: { id } });
  };

  return (
    <div className="module-stack">
      <CmSubnav />
      <div className="module-toolbar">
        <div>
          <h2 className="module-title">Idées de contenu</h2>
          <p className="module-sub">Créez, générez, adaptez et publiez les contenus de HABTI.</p>
        </div>
        <div className="heading-actions">
          <Button variant="outline" onClick={generer}><Sparkles />Générer avec l’IA</Button>
          <Button onClick={() => setCreation(true)}><Plus />Créer un post</Button>
        </div>
      </div>

      <section className="metrics-grid metrics-4">
        <Metric label="Contenus" value={String(socialPosts.length)} icon={Lightbulb} />
        <Metric label="À valider" value={String(socialPosts.filter((p) => p.statut === "À valider").length)} icon={CheckCircle2} tone="gold" />
        <Metric label="Planifiés" value={String(socialPosts.filter((p) => p.statut === "Planifié").length)} icon={CalendarDays} />
        <Metric label="Publiés" value={String(socialPosts.filter((p) => p.statut === "Publié").length)} icon={Send} />
      </section>

      <Panel className="agent-idea-panel">
        <PanelTitle title="Générateur de contenu IA" subtitle="Produisez des idées, puis validez humainement avant publication" />
        <div className="idea-row">
          <TextInput value={idee} onChange={(e) => setIdee(e.currentTarget.value)} placeholder="Thème à transformer en contenu…" />
          <Button onClick={generer}><Sparkles />Générer une idée</Button>
        </div>
      </Panel>

      <Panel>
        <div className="smart-filter">
          <div><Search /><input placeholder="Rechercher un contenu…" value={q} onChange={(e) => setQ(e.currentTarget.value)} /></div>
          <FilterSelect label="Plateforme" value={plateforme} options={PLATEFORMES_SOCIALES} onChange={setPlateforme} />
          <FilterSelect label="Type de contenu" value={type} options={TYPES_CONTENU} onChange={setType} />
          <FilterSelect label="Campagne" value={campagne} options={campagnes.map((c) => c.nom)} onChange={setCampagne} />
          <FilterSelect label="Statut" value={statut} options={STATUTS_PUBLICATION} onChange={setStatut} />
          <input className="filter-select" type="date" value={date} onChange={(e) => setDate(e.currentTarget.value)} aria-label="Date" />
          <input className="filter-select" placeholder="Thématique" value={theme} onChange={(e) => setTheme(e.currentTarget.value)} aria-label="Thématique" />
        </div>
        <ActiveChips chips={chips} onClear={reset} onRemove={removeChip} />

        {!liste.length ? (
          <EmptyState titre="Aucune publication trouvée." description="Ajustez vos filtres ou générez une nouvelle idée." ctaLabel="Réinitialiser les filtres" onCta={reset} icon={Lightbulb} />
        ) : (
          <div className="post-grid">
            {liste.map((post) => {
              const Icon = RESEAU_ICON[post.plateformes[0] ?? "Facebook"] ?? Facebook;
              const ouvrir = () => navigate({ to: "/community-manager/idees/$id", params: { id: post.id } });
              return (
                <Panel className="post-card" key={post.id}>
                  <button className="post-visual" onClick={ouvrir} aria-label={`Ouvrir ${post.titre}`}>
                    <img src={post.image} alt={post.titre} />
                    <span className={`origin-tag ${post.origine === "IA" ? "ia" : ""}`}>{post.origine === "IA" ? "IA" : "Manuel"}</span>
                  </button>
                  <div className="post-body">
                    <div className="campaign-head">
                      <div><b>{post.titre}</b><span><Icon />{post.plateformes.join(", ")} · {post.format}</span></div>
                      <StatutBadge statut={post.statut} />
                    </div>
                    <p>{post.legende.slice(0, 120)}{post.legende.length > 120 ? "…" : ""}</p>
                    <small className="post-meta"><CalendarDays />{dateFr(post.date)} à {post.heure} · {post.campagne}</small>
                    <div className="card-actions">
                      <Button size="sm" onClick={ouvrir}>Voir le détail</Button>
                      <Button size="sm" variant="outline" onClick={() => setEdition(post)}>Modifier</Button>
                      <Button size="sm" variant="outline" onClick={() => { updateSocialPost(post.id, { statut: "Publié" }); notify("Publication publiée."); }}>Publier maintenant</Button>
                      <Button size="sm" variant="outline" onClick={() => { updateSocialPost(post.id, { statut: "Planifié" }); notify("Publication planifiée."); }}>Planifier</Button>
                      <RowMenu actions={[
                        { label: "Voir le détail", onSelect: ouvrir },
                        { label: "Dupliquer", onSelect: () => { addSocialPost({ ...post, id: newId("POST"), titre: `Copie — ${post.titre}`, statut: "Brouillon" }); notify("Publication dupliquée."); } },
                        { label: "Valider", onSelect: () => { updateSocialPost(post.id, { statut: "Validé" }); notify("Publication validée."); } },
                        { label: "Supprimer", danger: true, onSelect: () => setSuppression(post) },
                      ]} />
                    </div>
                  </div>
                </Panel>
              );
            })}
          </div>
        )}
      </Panel>

      <FormModal open={creation} onOpenChange={setCreation} title="Créer un post" submitLabel="Créer" wide onSubmit={(e) => soumettre(e)}>
        <PostFields campagnes={campagnes.map((c) => c.nom)} />
      </FormModal>
      <FormModal open={!!edition} onOpenChange={(o) => !o && setEdition(null)} title="Modifier la publication" submitLabel="Enregistrer" wide onSubmit={(e) => soumettre(e, edition)}>
        <PostFields post={edition ?? undefined} campagnes={campagnes.map((c) => c.nom)} />
      </FormModal>
      <ConfirmDialog open={!!suppression} onOpenChange={(o) => !o && setSuppression(null)}
        titre="Supprimer cette publication ?" confirmLabel="Supprimer"
        onConfirm={() => { if (suppression) { removeSocialPost(suppression.id); notify("Publication supprimée."); } setSuppression(null); }} />
    </div>
  );
}

function PostFields({ post, campagnes }: { post?: SocialPost | undefined; campagnes: string[] }) {
  return (
    <>
      <Field label="Titre" full><TextInput name="titre" required defaultValue={post?.titre} /></Field>
      <Field label="Plateforme"><SelectInput name="plateforme" options={PLATEFORMES_SOCIALES} defaultValue={post?.plateformes[0]} /></Field>
      <Field label="Type de contenu"><SelectInput name="type" options={TYPES_CONTENU} defaultValue={post?.type} /></Field>
      <Field label="Statut"><SelectInput name="statut" options={STATUTS_PUBLICATION} defaultValue={post?.statut ?? "Brouillon"} /></Field>
      <Field label="Campagne"><SelectInput name="campagne" options={campagnes.length ? campagnes : ["Sans campagne"]} defaultValue={post?.campagne} /></Field>
      <Field label="Date"><TextInput name="date" type="date" defaultValue={post?.date ?? "2026-09-24"} /></Field>
      <Field label="Heure"><TextInput name="heure" type="time" defaultValue={post?.heure ?? "18:00"} /></Field>
      <Field label="Thématique"><TextInput name="theme" defaultValue={post?.theme ?? "Destination"} /></Field>
      <Field label="Format"><TextInput name="format" defaultValue={post?.format ?? "Post image"} /></Field>
      <Field label="CTA"><SelectInput name="cta" options={TYPES_CTA} defaultValue={post?.cta} /></Field>
      <Field label="Texte du post" full><TextArea name="legende" required defaultValue={post?.legende} /></Field>
      <Field label="Hashtags" full><TextInput name="hashtags" defaultValue={post?.hashtags ?? "#HabtiVoyage #Maroc"} /></Field>
    </>
  );
}

/* ============================ DÉTAIL POST ============================ */

export function PostDetailView({ id }: { id: string }) {
  const navigate = useNavigate();
  const { socialPosts, campagnes, addSocialPost, updateSocialPost, notify, agentSettings } = useHabti();
  const post = socialPosts.find((p) => p.id === id);
  const [edition, setEdition] = useState(false);
  const [planif, setPlanif] = useState(false);
  const [suggestions, setSuggestions] = useState(() => (post ? postSuggestions(post) : []));

  if (!post) {
    return <Panel><EmptyState titre="Publication introuvable" description="Ce contenu n’existe pas dans les données de démonstration." ctaLabel="Revenir aux idées" onCta={() => navigate({ to: "/community-manager/idees" })} /></Panel>;
  }

  const validationRequise = agentSettings.automatisation.find((a) => a.id === "validation")?.actif;
  const publier = () => {
    if (validationRequise && !["Validé", "Planifié"].includes(post.statut)) {
      updateSocialPost(post.id, { statut: "À valider" });
      notify("Validation humaine requise avant publication.");
      return;
    }
    updateSocialPost(post.id, { statut: "Publié" });
    notify("Publication publiée.");
  };
  const reseau = post.plateformes[0] ?? "Instagram";

  return (
    <div className="module-stack detail-page">
      <nav className="breadcrumb">
        <Link to="/community-manager/idees">Idées</Link><span>/</span><b>{post.titre}</b>
      </nav>
      <div className="detail-hero">
        <Button variant="ghost" onClick={() => navigate({ to: "/community-manager/idees" })}><ArrowLeft />Retour aux idées</Button>
        <div className="detail-hero-main">
          <img src={post.image} alt="" className="detail-thumb" />
          <div><h2>{post.titre}</h2><p>{post.plateformes.join(", ")} · {post.format} · Création {post.origine}</p></div>
          <StatutBadge statut={post.statut} />
        </div>
        <div className="detail-actions">
          <Button variant="outline" onClick={() => setEdition(true)}>Modifier</Button>
          <Button variant="outline" onClick={() => { const nid = newId("POST"); addSocialPost({ ...post, id: nid, titre: `Copie — ${post.titre}`, statut: "Brouillon" }); notify("Publication dupliquée."); navigate({ to: "/community-manager/idees/$id", params: { id: nid } }); }}>Dupliquer</Button>
          <Button variant="outline" onClick={() => setPlanif(true)}>Planifier</Button>
          <Button onClick={publier}>Publier maintenant</Button>
        </div>
      </div>

      <Tabs defaultValue="apercu" className="detail-tabs">
        <TabsList>
          <TabsTrigger value="apercu">Aperçu</TabsTrigger>
          <TabsTrigger value="contenu">Contenu</TabsTrigger>
          <TabsTrigger value="ia">Suggestions IA</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="apercu">
          <Panel>
            <PanelTitle title={`Aperçu ${reseau}`} subtitle="Rendu simulé du contenu sur le réseau sélectionné" />
            <div className={`network-preview ${reseau.toLowerCase()}`}>
              <header><span className="avatar-dot">H</span><div><b>HABTI Voyage</b><small>{dateFr(post.date)} · {post.heure}</small></div></header>
              <p>{post.legende}</p>
              <img src={post.image} alt={post.titre} />
              <footer><span>❤ 248</span><span>💬 36</span><span>↗ 19</span><b>{post.cta}</b></footer>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="contenu">
          <Panel>
            <PanelTitle title="Contenu de la publication" subtitle="Texte, hashtags, diffusion et intention commerciale" />
            <div className="data-grid">
              <div><span>Titre</span><b>{post.titre}</b></div>
              <div><span>Plateforme</span><b>{post.plateformes.join(", ")}</b></div>
              <div><span>Format</span><b>{post.format}</b></div>
              <div><span>Campagne</span><b>{post.campagne}</b></div>
              <div><span>Date</span><b>{dateFr(post.date)}</b></div>
              <div><span>Heure</span><b>{post.heure}</b></div>
              <div><span>CTA</span><b>{post.cta}</b></div>
              <div><span>Thématique</span><b>{post.theme}</b></div>
            </div>
            <h4 className="block-title">Texte</h4>
            <p className="muted-line">{post.legende}</p>
            <h4 className="block-title">Hashtags</h4>
            <p className="muted-line">{post.hashtags}</p>
            <div className="drawer-actions"><Button onClick={() => setEdition(true)}>Modifier le contenu</Button></div>
          </Panel>
        </TabsContent>

        <TabsContent value="ia">
          <Panel>
            <PanelTitle title="Suggestions de l’agent" subtitle="Chaque suggestion peut être appliquée, régénérée ou modifiée" />
            {suggestions.map((s) => (
              <div className="approval-row" key={s.id}>
                <Sparkles />
                <div className="approval-text"><b>{s.titre}</b><span>{s.texte}</span></div>
                <Button size="sm" onClick={() => { updateSocialPost(post.id, { [s.champ]: s.texte } as Partial<SocialPost>); notify("Suggestion appliquée au contenu."); }}>Utiliser cette suggestion</Button>
                <Button size="sm" variant="outline" onClick={() => { setSuggestions((l) => l.map((x) => x.id === s.id ? { ...x, texte: `${x.texte} ✦` } : x)); notify("Suggestion régénérée."); }}><RefreshCw />Regénérer</Button>
                <Button size="sm" variant="outline" onClick={() => setEdition(true)}>Modifier</Button>
              </div>
            ))}
          </Panel>
        </TabsContent>

        <TabsContent value="historique">
          <Panel>
            <PanelTitle title="Historique du contenu" subtitle="Traçabilité complète des étapes de validation" />
            <div className="mini-timeline">
              {postHistorique(post).map((h, i) => <p key={`${h.texte}-${i}`}><i />{h.texte} <span>{h.date}</span></p>)}
            </div>
          </Panel>
        </TabsContent>
      </Tabs>

      <FormModal open={edition} onOpenChange={setEdition} title="Modifier la publication" submitLabel="Enregistrer" wide
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          updateSocialPost(post.id, {
            titre: String(f.get("titre")), legende: String(f.get("legende")), hashtags: String(f.get("hashtags")),
            plateformes: [String(f.get("plateforme"))], type: String(f.get("type")), theme: String(f.get("theme")),
            date: String(f.get("date")), heure: String(f.get("heure")), statut: String(f.get("statut")) as StatutPublication,
            campagne: String(f.get("campagne")), cta: String(f.get("cta")), format: String(f.get("format")),
          });
          setEdition(false);
          notify("Publication mise à jour.");
        }}>
        <PostFields post={post} campagnes={campagnes.map((c) => c.nom)} />
      </FormModal>

      <FormModal open={planif} onOpenChange={setPlanif} title="Planifier la publication" submitLabel="Enregistrer la planification"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          updateSocialPost(post.id, { date: String(f.get("date")), heure: String(f.get("heure")), statut: "Planifié" });
          setPlanif(false);
          notify("Publication planifiée avec succès.");
          navigate({ to: "/community-manager/planning" });
        }}>
        <Field label="Date"><TextInput type="date" name="date" defaultValue={post.date} /></Field>
        <Field label="Heure"><TextInput type="time" name="heure" defaultValue={post.heure} /></Field>
      </FormModal>
    </div>
  );
}

/* ============================ PLANNING ============================ */

const MOIS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function PlanningEditorialView() {
  const navigate = useNavigate();
  const { socialPosts, campagnes, updateSocialPost, notify } = useHabti();
  const [vue, setVue] = useState<"Mois" | "Semaine" | "Jour">("Mois");
  const [curseur, setCurseur] = useState(new Date("2026-09-18T12:00:00"));
  const [plateforme, setPlateforme] = useState("Tous");
  const [statut, setStatut] = useState("Tous");
  const [campagne, setCampagne] = useState("Tous");
  const [type, setType] = useState("Tous");
  const [ajout, setAjout] = useState(false);
  const [jourChoisi, setJourChoisi] = useState<string | null>(null);
  const [drag, setDrag] = useState<string | null>(null);

  const filtres = useMemo(() => socialPosts.filter((p) => {
    if (plateforme !== "Tous" && !p.plateformes.includes(plateforme)) return false;
    if (statut !== "Tous" && p.statut !== statut) return false;
    if (campagne !== "Tous" && p.campagne !== campagne) return false;
    if (type !== "Tous" && p.type !== type) return false;
    return true;
  }), [socialPosts, plateforme, statut, campagne, type]);

  const jours = useMemo(() => {
    if (vue === "Jour") return [new Date(curseur)];
    if (vue === "Semaine") {
      const start = new Date(curseur);
      start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
      return Array.from({ length: 7 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
    }
    const first = new Date(curseur.getFullYear(), curseur.getMonth(), 1);
    const start = new Date(first);
    start.setDate(first.getDate() - ((first.getDay() + 6) % 7));
    return Array.from({ length: 42 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); return d; });
  }, [vue, curseur]);

  const decaler = (sens: number) => {
    const d = new Date(curseur);
    if (vue === "Mois") d.setMonth(d.getMonth() + sens);
    else if (vue === "Semaine") d.setDate(d.getDate() + sens * 7);
    else d.setDate(d.getDate() + sens);
    setCurseur(d);
  };

  const label = vue === "Mois"
    ? `${MOIS[curseur.getMonth()]} ${curseur.getFullYear()}`
    : vue === "Semaine" ? `Semaine du ${dateFr(iso(jours[0] as Date))}` : dateFr(iso(curseur));

  const chips = [
    plateforme !== "Tous" && { label: "Plateforme", value: plateforme },
    statut !== "Tous" && { label: "Statut", value: statut },
    campagne !== "Tous" && { label: "Campagne", value: campagne },
    type !== "Tous" && { label: "Type", value: type },
  ].filter(Boolean) as { label: string; value: string }[];

  const deposer = (jour: string) => {
    if (!drag) return;
    updateSocialPost(drag, { date: jour, statut: "Planifié" });
    setDrag(null);
    notify(`Publication déplacée au ${dateFr(jour)}.`);
  };

  return (
    <div className="module-stack">
      <CmSubnav />
      <div className="module-toolbar">
        <div>
          <h2 className="module-title">Planning éditorial</h2>
          <p className="module-sub">Visualisez et organisez les publications HABTI sur l’ensemble des réseaux sociaux.</p>
        </div>
        <Button onClick={() => { setJourChoisi(iso(curseur)); setAjout(true); }}><Plus />Ajouter une planification</Button>
      </div>

      <Panel>
        <div className="calendar-toolbar">
          <div className="segmented">
            {(["Mois", "Semaine", "Jour"] as const).map((v) => (
              <button key={v} className={vue === v ? "active" : ""} onClick={() => setVue(v)}>{v}</button>
            ))}
          </div>
          <div className="calendar-nav">
            <Button variant="outline" size="icon" aria-label="Précédent" onClick={() => decaler(-1)}><ChevronLeft /></Button>
            <b>{label}</b>
            <Button variant="outline" size="icon" aria-label="Suivant" onClick={() => decaler(1)}><ChevronRight /></Button>
            <Button variant="ghost" onClick={() => setCurseur(new Date("2026-09-18T12:00:00"))}>Aujourd’hui</Button>
          </div>
        </div>
        <div className="smart-filter">
          <FilterSelect label="Plateforme" value={plateforme} options={PLATEFORMES_SOCIALES} onChange={setPlateforme} />
          <FilterSelect label="Statut" value={statut} options={STATUTS_PUBLICATION} onChange={setStatut} />
          <FilterSelect label="Campagne" value={campagne} options={campagnes.map((c) => c.nom)} onChange={setCampagne} />
          <FilterSelect label="Type de contenu" value={type} options={TYPES_CONTENU} onChange={setType} />
        </div>
        <ActiveChips chips={chips} onClear={() => { setPlateforme("Tous"); setStatut("Tous"); setCampagne("Tous"); setType("Tous"); }}
          onRemove={(l) => { if (l === "Plateforme") setPlateforme("Tous"); if (l === "Statut") setStatut("Tous"); if (l === "Campagne") setCampagne("Tous"); if (l === "Type") setType("Tous"); }} />

        <div className={`editorial-calendar vue-${vue.toLowerCase()}`}>
          {vue === "Mois" && JOURS_SEMAINE.map((j) => <div className="cal-head" key={j}>{j}</div>)}
          {jours.map((d) => {
            const key = iso(d);
            const duJour = filtres.filter((p) => p.date === key);
            const horsMois = vue === "Mois" && d.getMonth() !== curseur.getMonth();
            return (
              <div key={key} className={`cal-cell ${horsMois ? "muted" : ""}`}
                onDragOver={(e) => e.preventDefault()} onDrop={() => deposer(key)}>
                <button className="cal-day" onClick={() => { setJourChoisi(key); setAjout(true); }}>{d.getDate()}</button>
                {duJour.map((p) => {
                  const Icon = RESEAU_ICON[p.plateformes[0] ?? "Facebook"] ?? Facebook;
                  return (
                    <div key={p.id} className={`cal-post statut-${p.statut.toLowerCase().replace(/\s|à|é/g, "")}`} draggable
                      onDragStart={() => setDrag(p.id)}
                      onClick={() => navigate({ to: "/community-manager/idees/$id", params: { id: p.id } })}
                      onDoubleClick={() => navigate({ to: "/community-manager/idees/$id", params: { id: p.id } })}>
                      <img src={p.image} alt="" />
                      <div><b>{p.titre}</b><span><Icon />{p.heure} · {p.statut}</span></div>
                      <RowMenu actions={[
                        { label: "Voir le détail", onSelect: () => navigate({ to: "/community-manager/idees/$id", params: { id: p.id } }) },
                        { label: "Changer l’heure", onSelect: () => { const h = window.prompt("Nouvelle heure (HH:MM)", p.heure); if (h) { updateSocialPost(p.id, { heure: h }); notify("Horaire mis à jour."); } } },
                        { label: "Retirer du planning", onSelect: () => { updateSocialPost(p.id, { statut: "Brouillon" }); notify("Publication retirée du planning."); } },
                        { label: "Publier maintenant", onSelect: () => { updateSocialPost(p.id, { statut: "Publié" }); notify("Publication publiée."); } },
                      ]} />
                    </div>
                  );
                })}
                {!duJour.length && !horsMois && <span className="cal-empty">—</span>}
              </div>
            );
          })}
        </div>
      </Panel>

      <FormModal open={ajout} onOpenChange={setAjout} title="Ajouter une planification" submitLabel="Enregistrer la planification"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const cible = socialPosts.find((p) => p.titre === String(f.get("publication")));
          if (cible) {
            updateSocialPost(cible.id, {
              date: String(f.get("date")), heure: String(f.get("heure")), campagne: String(f.get("campagne")),
              plateformes: [String(f.get("plateforme"))], statut: String(f.get("statut")) as StatutPublication,
            });
          }
          setAjout(false);
          notify("Publication planifiée avec succès.");
        }}>
        <Field label="Publication" full><SelectInput name="publication" options={socialPosts.map((p) => p.titre)} /></Field>
        <Field label="Plateforme"><SelectInput name="plateforme" options={PLATEFORMES_SOCIALES} /></Field>
        <Field label="Campagne"><SelectInput name="campagne" options={campagnes.map((c) => c.nom)} /></Field>
        <Field label="Date"><TextInput type="date" name="date" defaultValue={jourChoisi ?? iso(curseur)} /></Field>
        <Field label="Heure"><TextInput type="time" name="heure" defaultValue="18:00" /></Field>
        <Field label="Statut"><SelectInput name="statut" options={STATUTS_PUBLICATION} defaultValue="Planifié" /></Field>
      </FormModal>
    </div>
  );
}

/* ============================ PARAMÈTRES DE L'AGENT ============================ */

function Counter({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="counter-row">
      <span>{label}</span>
      <div>
        <Button variant="outline" size="icon" aria-label="Diminuer" onClick={() => onChange(Math.max(0, value - 1))}><Minus /></Button>
        <b>{value}</b>
        <Button variant="outline" size="icon" aria-label="Augmenter" onClick={() => onChange(value + 1)}><Plus /></Button>
      </div>
    </div>
  );
}

export function ParametresAgentView() {
  const { agentSettings, updateAgentSettings, resetAgentSettings, notify } = useHabti();
  const [local, setLocal] = useState(agentSettings);
  const total = local.repartition.reduce((s, r) => s + r.valeur, 0);

  const setFreq = (reseau: "Facebook" | "Instagram" | "TikTok", patch: Partial<typeof local.frequence.Facebook>) =>
    setLocal((s) => ({ ...s, frequence: { ...s.frequence, [reseau]: { ...s.frequence[reseau], ...patch } } }));
  const toggleJour = (reseau: "Facebook" | "Instagram" | "TikTok", jour: string) =>
    setFreq(reseau, { jours: local.frequence[reseau].jours.includes(jour) ? local.frequence[reseau].jours.filter((j) => j !== jour) : [...local.frequence[reseau].jours, jour] });

  const enregistrer = () => {
    if (total !== 100) { notify("La répartition doit totaliser 100 % avant enregistrement."); return; }
    updateAgentSettings(local);
    notify("Paramètres de l’agent enregistrés.");
  };

  return (
    <div className="module-stack">
      <CmSubnav />
      <div className="module-toolbar">
        <div>
          <h2 className="module-title">Paramètres de l’Agent Community Manager</h2>
          <p className="module-sub">Définissez la fréquence, la ligne éditoriale et le niveau d’automatisation de l’agent.</p>
        </div>
        <div className="heading-actions">
          <Button variant="outline" onClick={() => { resetAgentSettings(); setLocal(agentSettings); notify("Paramètres réinitialisés."); }}>Réinitialiser</Button>
          <Button onClick={enregistrer}>Enregistrer les paramètres</Button>
        </div>
      </div>

      <section className="agent-settings-grid">
        {(["Facebook", "Instagram", "TikTok"] as const).map((reseau) => {
          const Icon = RESEAU_ICON[reseau] ?? Facebook;
          const conf = local.frequence[reseau];
          return (
            <Panel className="frequency-card" key={reseau}>
              <div className="frequency-head"><Icon /><b>{reseau}</b></div>
              {reseau === "TikTok"
                ? <Counter label="Vidéos / semaine" value={conf.videos ?? 0} onChange={(v) => setFreq(reseau, { videos: v })} />
                : <Counter label="Publications / semaine" value={conf.publications} onChange={(v) => setFreq(reseau, { publications: v })} />}
              {reseau === "Instagram" && <>
                <Counter label="Stories / semaine" value={conf.stories ?? 0} onChange={(v) => setFreq(reseau, { stories: v })} />
                <Counter label="Reels / semaine" value={conf.reels ?? 0} onChange={(v) => setFreq(reseau, { reels: v })} />
              </>}
              <span className="field-label">Jours préférés</span>
              <div className="day-picker">
                {JOURS_SEMAINE.map((j) => (
                  <button key={j} type="button" className={conf.jours.includes(j) ? "active" : ""} onClick={() => toggleJour(reseau, j)} aria-label={j}>{j[0]}</button>
                ))}
              </div>
              <span className="field-label">Heures préférées</span>
              <div className="hours-row">
                {conf.heures.map((h, i) => (
                  <input key={`${reseau}-${i}`} className="habti-input" type="time" value={h}
                    onChange={(e) => setFreq(reseau, { heures: conf.heures.map((x, xi) => (xi === i ? e.currentTarget.value : x)) })} />
                ))}
                <Button variant="outline" size="sm" onClick={() => setFreq(reseau, { heures: [...conf.heures, "12:00"] })}><Plus />Ajouter</Button>
              </div>
            </Panel>
          );
        })}
      </section>

      <Panel>
        <PanelTitle title="Ligne éditoriale" subtitle="Ton, audience et vocabulaire de la marque HABTI" />
        <div className="form-grid">
          <Field label="Ton de communication"><SelectInput options={TONS_EDITORIAUX} value={local.ligne.ton} onChange={(e) => setLocal((s) => ({ ...s, ligne: { ...s.ligne, ton: e.currentTarget.value } }))} /></Field>
          <Field label="Langue"><SelectInput options={LANGUES} value={local.ligne.langue} onChange={(e) => setLocal((s) => ({ ...s, ligne: { ...s.ligne, langue: e.currentTarget.value } }))} /></Field>
          <Field label="Type de CTA"><SelectInput options={TYPES_CTA} value={local.ligne.cta} onChange={(e) => setLocal((s) => ({ ...s, ligne: { ...s.ligne, cta: e.currentTarget.value } }))} /></Field>
          <Field label="Audience cible"><TextInput value={local.ligne.audience} onChange={(e) => setLocal((s) => ({ ...s, ligne: { ...s.ligne, audience: e.currentTarget.value } }))} /></Field>
          <Field label="Thématiques prioritaires" full><TextArea value={local.ligne.thematiques} onChange={(e) => setLocal((s) => ({ ...s, ligne: { ...s.ligne, thematiques: e.currentTarget.value } }))} /></Field>
          <Field label="Thématiques interdites" full><TextArea value={local.ligne.interdits} onChange={(e) => setLocal((s) => ({ ...s, ligne: { ...s.ligne, interdits: e.currentTarget.value } }))} /></Field>
          <Field label="Hashtags recommandés" full><TextInput value={local.ligne.hashtags} onChange={(e) => setLocal((s) => ({ ...s, ligne: { ...s.ligne, hashtags: e.currentTarget.value } }))} /></Field>
          <Field label="Mots à privilégier"><TextInput value={local.ligne.motsPrivilegier} onChange={(e) => setLocal((s) => ({ ...s, ligne: { ...s.ligne, motsPrivilegier: e.currentTarget.value } }))} /></Field>
          <Field label="Mots à éviter"><TextInput value={local.ligne.motsEviter} onChange={(e) => setLocal((s) => ({ ...s, ligne: { ...s.ligne, motsEviter: e.currentTarget.value } }))} /></Field>
        </div>
      </Panel>

      <Panel>
        <PanelTitle title="Répartition du contenu" subtitle={`Total actuel : ${total} % — l’enregistrement exige 100 %`} />
        <div className="repartition">
          {local.repartition.map((r, i) => (
            <div className="repartition-row" key={r.label}>
              <span>{r.label}</span>
              <input type="range" min={0} max={60} value={r.valeur}
                onChange={(e) => { const v = Number(e.currentTarget.value); setLocal((s) => ({ ...s, repartition: s.repartition.map((x, xi) => (xi === i ? { ...x, valeur: v } : x)) })); }} />
              <Progress value={r.valeur * 2} />
              <b>{r.valeur} %</b>
            </div>
          ))}
        </div>
        <div className={`repartition-total ${total === 100 ? "ok" : "warn"}`}>
          {total === 100 ? "Répartition valide (100 %)." : `Ajustez la répartition : ${total} % au lieu de 100 %.`}
        </div>
      </Panel>

      <Panel>
        <PanelTitle title="Automatisation" subtitle="L’agent n’exécute que ce que vous autorisez explicitement" />
        <div className="toggle-list">
          {local.automatisation.map((a) => {
            const bloque = a.id === "publication" && (local.automatisation.find((x) => x.id === "validation")?.actif ?? false);
            return (
              <label className="toggle-row" key={a.id}>
                <span>{a.label}{bloque && <small> — bloqué par la validation humaine</small>}</span>
                <Switch checked={a.actif && !bloque} disabled={bloque}
                  onCheckedChange={(v) => { setLocal((s) => ({ ...s, automatisation: s.automatisation.map((x) => (x.id === a.id ? { ...x, actif: v } : x)) })); notify(`${a.label} : ${v ? "activé" : "désactivé"}.`); }} />
              </label>
            );
          })}
        </div>
      </Panel>

      <Panel>
        <PanelTitle title="Réseaux sociaux" subtitle="Mode démonstration — aucune connexion externe active." />
        <div className="connection-grid">
          {local.connexions.map((c) => {
            const Icon = RESEAU_ICON[c.reseau] ?? Facebook;
            return (
              <div className="connection-card" key={c.reseau}>
                <div className="connection-head"><Icon /><div><b>{c.reseau}</b><span>{c.compte}</span></div></div>
                <StatutBadge statut={c.connecte ? "Active" : "Désactivée"} />
                <span className="muted-line">{c.connecte ? "Connecté (démonstration)" : "Non connecté"}</span>
                <div className="card-actions">
                  <Button size="sm" variant="outline" onClick={() => { setLocal((s) => ({ ...s, connexions: s.connexions.map((x) => (x.reseau === c.reseau ? { ...x, connecte: true } : x)) })); notify(`${c.reseau} configuré en mode démonstration.`); }}><Plug />Configurer</Button>
                  <Button size="sm" variant="outline" disabled={!c.connecte} onClick={() => { setLocal((s) => ({ ...s, connexions: s.connexions.map((x) => (x.reseau === c.reseau ? { ...x, connecte: false } : x)) })); notify(`${c.reseau} déconnecté.`); }}><Trash2 />Déconnecter</Button>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <div className="sticky-save">
        <span>Les modifications ne sont appliquées qu’après enregistrement.</span>
        <Button onClick={enregistrer}>Enregistrer les paramètres</Button>
      </div>
    </div>
  );
}
