import { useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Clock3, MapPin, Plus, Search, Sparkle, Target } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ActiveChips, ConfirmDialog, EmptyState, Field, FilterSelect, FormModal, Metric, Pager, Panel,
  RowMenu, SelectInput, StatutBadge, TextArea, TextInput,
} from "@/components/habti/ui-bits";
import { useHabti } from "@/lib/habti-store";
import {
  MOODS, SOURCES, STATUTS_PROSPECT, TYPES_DEMANDE, VILLES, euro, newId,
  type Prospect, type StatutProspect,
} from "@/lib/habti-data";

const PAGE_SIZE = 5;
const BUDGETS = ["< 5 000 €", "5 000 – 15 000 €", "> 15 000 €"];

export function ProspectsView() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { statut?: string; nouveau?: string; id?: string };
  const { prospects, addProspect, updateProspect, notify } = useHabti();

  const [q, setQ] = useState("");
  const [ville, setVille] = useState("Tous");
  const [source, setSource] = useState("Tous");
  const [mood, setMood] = useState("Tous");
  const [budget, setBudget] = useState("Tous");
  const [statut, setStatut] = useState(search.statut ?? "Tous");
  const [tri, setTri] = useState<{ col: "nom" | "score" | "budget"; asc: boolean }>({ col: "score", asc: false });
  const [page, setPage] = useState(1);
  const [creation, setCreation] = useState(search.nouveau === "1");
  const [edition, setEdition] = useState<Prospect | null>(null);
  const [archive, setArchive] = useState<Prospect | null>(null);

  const filtres = useMemo(() => {
    const list = prospects.filter((p) => {
      const texte = `${p.prenom} ${p.nom} ${p.email} ${p.activites} ${p.ville}`.toLowerCase();
      if (q && !texte.includes(q.toLowerCase())) return false;
      if (ville !== "Tous" && p.ville !== ville) return false;
      if (source !== "Tous" && p.source !== source) return false;
      if (mood !== "Tous" && p.mood !== mood) return false;
      if (statut !== "Tous" && p.statut !== statut) return false;
      if (budget === BUDGETS[0] && p.budget >= 5000) return false;
      if (budget === BUDGETS[1] && (p.budget < 5000 || p.budget > 15000)) return false;
      if (budget === BUDGETS[2] && p.budget <= 15000) return false;
      return true;
    });
    const sorted = [...list].sort((a, b) => {
      const dir = tri.asc ? 1 : -1;
      if (tri.col === "nom") return a.nom.localeCompare(b.nom) * dir;
      if (tri.col === "budget") return (a.budget - b.budget) * dir;
      return (a.score - b.score) * dir;
    });
    return sorted;
  }, [prospects, q, ville, source, mood, statut, budget, tri]);

  const pages = Math.max(1, Math.ceil(filtres.length / PAGE_SIZE));
  const pageSafe = Math.min(page, pages);
  const visibles = filtres.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);

  const chips = [
    ville !== "Tous" && { label: "Ville", value: ville },
    source !== "Tous" && { label: "Source", value: source },
    mood !== "Tous" && { label: "Mood", value: mood },
    budget !== "Tous" && { label: "Budget", value: budget },
    statut !== "Tous" && { label: "Statut", value: statut },
    q && { label: "Recherche", value: q },
  ].filter(Boolean) as { label: string; value: string }[];

  const reset = () => { setQ(""); setVille("Tous"); setSource("Tous"); setMood("Tous"); setBudget("Tous"); setStatut("Tous"); setPage(1); };
  const removeChip = (label: string) => {
    if (label === "Ville") setVille("Tous");
    if (label === "Source") setSource("Tous");
    if (label === "Mood") setMood("Tous");
    if (label === "Budget") setBudget("Tous");
    if (label === "Statut") setStatut("Tous");
    if (label === "Recherche") setQ("");
  };

  const soumettre = (e: React.FormEvent<HTMLFormElement>, existant?: Prospect | null) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const base = {
      prenom: get("prenom"), nom: get("nom"), telephone: get("telephone"), email: get("email"),
      ville: get("ville"), source: get("source"), typeDemande: get("typeDemande"),
      dateSouhaitee: get("dateSouhaitee"), personnes: Number(f.get("personnes") || 1),
      budget: Number(f.get("budget") || 0), mood: get("mood"), activites: get("activites"),
      statut: get("statut") as StatutProspect,
    };
    if (existant) {
      updateProspect(existant.id, base);
      setEdition(null);
      notify("Modification enregistrée.");
      return;
    }
    const nouveau: Prospect = {
      ...base, id: newId("P"), notes: get("notes") ? [{ id: newId("n"), texte: get("notes"), date: new Date().toLocaleDateString("fr-FR"), auteur: "Salma Bennani" }] : [],
      score: 60, conseiller: "Salma Bennani", createdAt: new Date().toISOString().slice(0, 10),
      historique: [{ texte: "Prospect créé manuellement", date: new Date().toLocaleString("fr-FR") }],
    };
    addProspect(nouveau);
    setCreation(false);
    reset();
    setTri({ col: "score", asc: false });
    navigate({ to: "/prospects/$id", params: { id: nouveau.id } });
    notify("Prospect créé avec succès.");
  };

  const pipeline = STATUTS_PROSPECT.slice(0, 7);

  return (
    <div className="module-stack">
      <div className="module-toolbar">
        <div className="pipeline">
          <button className={statut === "Tous" ? "active" : ""} onClick={() => { setStatut("Tous"); setPage(1); }}>
            <span>{String(prospects.length).padStart(2, "0")}</span>Tous
          </button>
          {pipeline.map((s) => (
            <button key={s} className={statut === s ? "active" : ""} onClick={() => { setStatut(s); setPage(1); }}>
              <span>{String(prospects.filter((p) => p.statut === s).length).padStart(2, "0")}</span>{s}
            </button>
          ))}
        </div>
        <Button onClick={() => setCreation(true)}><Plus />Nouveau prospect</Button>
      </div>

      <section className="metrics-grid metrics-3">
        <Metric label="Prospects actifs" value={String(prospects.filter((p) => p.statut !== "Perdu").length)} icon={Target} />
        <Metric label="Score moyen" value={`${Math.round(prospects.reduce((s, p) => s + p.score, 0) / (prospects.length || 1))}/100`} icon={Sparkle} tone="gold" />
        <Metric label="Budget cumulé" value={euro(prospects.reduce((s, p) => s + p.budget, 0))} icon={Clock3} />
      </section>

      <Panel className="crm-panel">
        <div className="smart-filter">
          <div><Search /><input placeholder="Rechercher un prospect…" value={q} onChange={(e) => { setQ(e.currentTarget.value); setPage(1); }} /></div>
          <FilterSelect label="Ville" value={ville} options={VILLES} onChange={(v) => { setVille(v); setPage(1); }} />
          <FilterSelect label="Type de demande" value={source} options={SOURCES} onChange={(v) => { setSource(v); setPage(1); }} />
          <FilterSelect label="Budget" value={budget} options={BUDGETS} onChange={(v) => { setBudget(v); setPage(1); }} />
          <FilterSelect label="Mood" value={mood} options={MOODS} onChange={(v) => { setMood(v); setPage(1); }} />
          <FilterSelect label="Statut" value={statut} options={STATUTS_PROSPECT} onChange={(v) => { setStatut(v); setPage(1); }} />
        </div>
        <ActiveChips chips={chips} onClear={reset} onRemove={removeChip} />

        {visibles.length === 0 ? (
          <EmptyState titre="Aucun prospect ne correspond à vos filtres."
            description="Ajustez vos critères ou repartez de la liste complète."
            ctaLabel="Réinitialiser les filtres" onCta={reset} icon={Target} />
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th><button onClick={() => setTri({ col: "nom", asc: tri.col === "nom" ? !tri.asc : true })}>Prospect</button></th>
                    <th>Demande</th>
                    <th><button onClick={() => setTri({ col: "budget", asc: tri.col === "budget" ? !tri.asc : true })}>Budget</button></th>
                    <th><button onClick={() => setTri({ col: "score", asc: tri.col === "score" ? !tri.asc : true })}>Score</button></th>
                    <th>Statut</th>
                    <th>Source</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((p) => (
                    <tr key={p.id} onClick={() => navigate({ to: "/prospects/$id", params: { id: p.id } })}>
                      <td>
                        <Avatar><AvatarFallback>{p.prenom[0]}{p.nom[0]}</AvatarFallback></Avatar>
                        <div><b>{p.prenom} {p.nom}</b><span><MapPin />{p.ville}</span></div>
                      </td>
                      <td>{p.typeDemande} · {p.personnes} pers.</td>
                      <td><b>{euro(p.budget)}</b></td>
                      <td><div className="score"><span>{p.score}</span><Progress value={p.score} /></div></td>
                      <td><StatutBadge statut={p.statut} /></td>
                      <td>{p.source}</td>
                      <td>
                        <RowMenu actions={[
                          { label: "Voir les détails", onSelect: () => navigate({ to: "/prospects/$id", params: { id: p.id } }) },
                          { label: "Modifier", onSelect: () => setEdition(p) },
                          { label: "Créer un devis", onSelect: () => navigate({ to: "/devis", search: { nouveau: "1" } }) },
                          { label: "Créer une réservation", onSelect: () => navigate({ to: "/reservations", search: { nouveau: "1" } }) },
                          { label: "Marquer comme client", onSelect: () => { updateProspect(p.id, { statut: "Client" }); notify("Prospect converti en client."); } },
                          { label: "Archiver", danger: true, onSelect: () => setArchive(p) },
                        ]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pager page={pageSafe} pages={pages} onPage={setPage} />
          </>
        )}
      </Panel>

      <FormModal open={creation} onOpenChange={setCreation} title="Nouveau prospect"
        description="Renseignez la demande pour lancer la qualification." submitLabel="Enregistrer le prospect"
        onSubmit={(e) => soumettre(e)} wide>
        <ProspectFields />
      </FormModal>

      <FormModal open={!!edition} onOpenChange={(o) => !o && setEdition(null)} title="Modifier le prospect"
        submitLabel="Enregistrer" onSubmit={(e) => soumettre(e, edition)} wide>
        <ProspectFields prospect={edition ?? undefined} />
      </FormModal>

      <ConfirmDialog open={!!archive} onOpenChange={(o) => !o && setArchive(null)}
        titre="Êtes-vous sûr de vouloir archiver ce prospect ?"
        description="Le prospect passera au statut « Perdu » et sortira du pipeline actif."
        confirmLabel="Confirmer l'archivage"
        onConfirm={() => { if (archive) { updateProspect(archive.id, { statut: "Perdu" }); notify("Prospect archivé."); } setArchive(null); }} />

    </div>
  );
}

function ProspectFields({ prospect }: { prospect?: Prospect | undefined }) {
  return (
    <>
      <Field label="Prénom"><TextInput name="prenom" required defaultValue={prospect?.prenom} placeholder="Sofia" /></Field>
      <Field label="Nom"><TextInput name="nom" required defaultValue={prospect?.nom} placeholder="Martinez" /></Field>
      <Field label="Téléphone"><TextInput name="telephone" required defaultValue={prospect?.telephone} placeholder="+212 6 61 00 00 00" /></Field>
      <Field label="E-mail"><TextInput type="email" name="email" required defaultValue={prospect?.email} placeholder="prenom.nom@mail.com" /></Field>
      <Field label="Ville"><SelectInput name="ville" options={VILLES} defaultValue={prospect?.ville} /></Field>
      <Field label="Source"><SelectInput name="source" options={SOURCES} defaultValue={prospect?.source} /></Field>
      <Field label="Type de demande"><SelectInput name="typeDemande" options={TYPES_DEMANDE} defaultValue={prospect?.typeDemande} /></Field>
      <Field label="Date souhaitée"><TextInput type="date" name="dateSouhaitee" defaultValue={prospect?.dateSouhaitee} /></Field>
      <Field label="Nombre de personnes"><TextInput type="number" min={1} name="personnes" defaultValue={prospect?.personnes ?? 2} /></Field>
      <Field label="Budget estimé (€)"><TextInput type="number" min={0} step={100} name="budget" defaultValue={prospect?.budget ?? 2000} /></Field>
      <Field label="Mood / préférence"><SelectInput name="mood" options={MOODS} defaultValue={prospect?.mood} /></Field>
      <Field label="Statut"><SelectInput name="statut" options={STATUTS_PROSPECT} defaultValue={prospect?.statut ?? "Nouveau"} /></Field>
      <Field label="Activités souhaitées" full><TextInput name="activites" defaultValue={prospect?.activites} placeholder="Excursion désert, Hammam & Spa…" /></Field>
      <Field label="Notes" full><TextArea name="notes" placeholder="Contexte, contraintes, préférences…" /></Field>
    </>
  );
}
