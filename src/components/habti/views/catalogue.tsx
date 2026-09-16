import { useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Check, Clock3, MapPin, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ActiveChips, ConfirmDialog, EmptyState, Field, FilterSelect, FormModal, Panel, RowMenu, SelectInput, StatutBadge, TextArea, TextInput,
} from "@/components/habti/ui-bits";
import { useHabti } from "@/lib/habti-store";
import { CATEGORIES_PRESTATION, MOODS, VILLES, euro, newId, type Prestation } from "@/lib/habti-data";
import riad from "@/assets/marrakech-riad.jpg";

const DISPOS = ["Disponible", "Dernières places", "Complet"] as const;
const PRIX = ["< 250 €", "250 – 500 €", "> 500 €"];

export function CatalogueView({ evenementsSeuls = false }: { evenementsSeuls?: boolean }) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { nouveau?: string; id?: string };
  const { prestations, addPrestation, updatePrestation, notify } = useHabti();

  const [onglet, setOnglet] = useState<string>(evenementsSeuls ? "Événement" : "Tous");
  const [q, setQ] = useState("");
  const [ville, setVille] = useState("Tous");
  const [mood, setMood] = useState("Tous");
  const [prix, setPrix] = useState("Tous");
  const [dispo, setDispo] = useState("Tous");
  const [compare, setCompare] = useState<string[]>([]);
  const [creation, setCreation] = useState(search.nouveau === "1");
  const [edition, setEdition] = useState<Prestation | null>(null);
  const [detail, setDetail] = useState<Prestation | null>(prestations.find((p) => p.id === search.id) ?? null);
  const [desactivation, setDesactivation] = useState<Prestation | null>(null);

  const liste = useMemo(() => prestations.filter((p) => {
    if (evenementsSeuls && p.categorie !== "Événement") return false;
    if (!evenementsSeuls && onglet !== "Tous" && p.categorie !== onglet) return false;
    if (q && !`${p.nom} ${p.ville} ${p.description}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (ville !== "Tous" && p.ville !== ville) return false;
    if (mood !== "Tous" && !p.moods.includes(mood)) return false;
    if (dispo !== "Tous" && p.disponibilite !== dispo) return false;
    if (prix === PRIX[0] && p.prix >= 250) return false;
    if (prix === PRIX[1] && (p.prix < 250 || p.prix > 500)) return false;
    if (prix === PRIX[2] && p.prix <= 500) return false;
    return true;
  }), [prestations, evenementsSeuls, onglet, q, ville, mood, prix, dispo]);

  const chips = [
    ville !== "Tous" && { label: "Ville", value: ville },
    mood !== "Tous" && { label: "Mood", value: mood },
    prix !== "Tous" && { label: "Prix", value: prix },
    dispo !== "Tous" && { label: "Disponibilité", value: dispo },
    q && { label: "Recherche", value: q },
  ].filter(Boolean) as { label: string; value: string }[];
  const reset = () => { setQ(""); setVille("Tous"); setMood("Tous"); setPrix("Tous"); setDispo("Tous"); };

  const soumettre = (e: React.FormEvent<HTMLFormElement>, existante?: Prestation | null) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const base = {
      nom: String(f.get("nom")), ville: String(f.get("ville")), categorie: String(f.get("categorie")),
      prix: Number(f.get("prix") || 0), duree: String(f.get("duree")), capacite: Number(f.get("capacite") || 1),
      disponibilite: String(f.get("disponibilite")), description: String(f.get("description") ?? ""),
      moods: [String(f.get("mood"))],
    };
    if (existante) {
      updatePrestation(existante.id, base);
      setEdition(null);
      notify("Modification enregistrée.");
      return;
    }
    addPrestation({ ...base, id: newId("A"), statut: "Active", image: riad, score: 85 });
    setCreation(false);
    notify("Prestation ajoutée au catalogue.");
  };

  return (
    <div className="module-stack">
      <div className="module-toolbar">
        {!evenementsSeuls ? (
          <div className="tabs-bar">
            {["Tous", ...CATEGORIES_PRESTATION].map((t) => (
              <button key={t} className={onglet === t ? "active" : ""} onClick={() => setOnglet(t)}>
                {t === "Activité" ? "Activités" : t === "Voyage" ? "Voyages" : t === "Événement" ? "Événements" : t === "Package" ? "Packages" : "Tous"}
              </button>
            ))}
          </div>
        ) : <div className="tabs-bar"><button className="active">Événements & séminaires</button></div>}
        <Button onClick={() => setCreation(true)}><Plus />Ajouter une prestation</Button>
      </div>

      <Panel className="filter-panel">
        <div className="smart-filter">
          <div><Search /><input placeholder="Rechercher une prestation…" value={q} onChange={(e) => setQ(e.currentTarget.value)} /></div>
          <FilterSelect label="Ville" value={ville} options={VILLES} onChange={setVille} />
          <FilterSelect label="Mood" value={mood} options={MOODS} onChange={setMood} />
          <FilterSelect label="Prix" value={prix} options={PRIX} onChange={setPrix} />
          <FilterSelect label="Disponibilité" value={dispo} options={DISPOS} onChange={setDispo} />
        </div>
        <ActiveChips chips={chips} onClear={reset} onRemove={(l) => {
          if (l === "Ville") setVille("Tous"); if (l === "Mood") setMood("Tous");
          if (l === "Prix") setPrix("Tous"); if (l === "Disponibilité") setDispo("Tous"); if (l === "Recherche") setQ("");
        }} />
      </Panel>

      {liste.length === 0 ? (
        <Panel><EmptyState titre="Aucune prestation ne correspond à vos filtres." ctaLabel="Réinitialiser les filtres" onCta={reset} icon={MapPin} /></Panel>
      ) : (
        <div className="catalog-grid">
          {liste.map((e) => (
            <article className="experience-card" key={e.id}>
              <div className="experience-image">
                <img src={e.image} alt={e.nom} loading="lazy" width="1200" height="912" />
                <Badge>{e.score} % de correspondance</Badge>
                <StatutBadge statut={e.disponibilite === "Complet" ? "Annulée" : "Confirmée"} />
              </div>
              <div className="experience-body">
                <div><span><MapPin />{e.ville}</span><span><Clock3 />{e.duree}</span></div>
                <h3>{e.nom}</h3>
                <p>{e.description}</p>
                <div className="tag-row">
                  {e.moods.map((t) => <Badge variant="outline" key={t}>{t}</Badge>)}
                  <Badge variant="outline">{e.categorie}</Badge>
                  <Badge variant="outline">{e.capacite} places</Badge>
                </div>
                <footer>
                  <b>À partir de {euro(e.prix)}</b>
                  <div className="card-actions">
                    <Button variant="outline" size="sm" onClick={() => setDetail(e)}>Voir</Button>
                    <Button size="sm" onClick={() => setCompare((c) => c.includes(e.id) ? c.filter((x) => x !== e.id) : [...c, e.id])}>
                      {compare.includes(e.id) ? <Check /> : <Plus />}{compare.includes(e.id) ? "Sélectionnée" : "Comparer"}
                    </Button>
                    <RowMenu actions={[
                      { label: "Modifier", onSelect: () => setEdition(e) },
                      { label: "Dupliquer", onSelect: () => { addPrestation({ ...e, id: newId("A"), nom: `${e.nom} (copie)` }); notify("Prestation dupliquée."); } },
                      { label: "Créer une réservation", onSelect: () => navigate({ to: "/reservations", search: { nouveau: "1" } }) },
                      { label: e.statut === "Active" ? "Désactiver" : "Réactiver", danger: e.statut === "Active", onSelect: () => e.statut === "Active" ? setDesactivation(e) : (updatePrestation(e.id, { statut: "Active" }), notify("Prestation réactivée.")) },
                    ]} />
                  </div>
                </footer>
              </div>
            </article>
          ))}
        </div>
      )}

      {compare.length > 0 && (
        <div className="compare-dock">
          <div><b>{compare.length} prestation(s) sélectionnée(s)</b><span>Comparez tarifs, capacités et disponibilités</span></div>
          <Button variant="outline" onClick={() => setCompare([])}>Vider la sélection</Button>
          <Button onClick={() => { notify("Comparatif envoyé au client."); setCompare([]); }}>Proposer au client</Button>
        </div>
      )}

      <FormModal open={creation} onOpenChange={setCreation} title="Ajouter une prestation" submitLabel="Ajouter au catalogue" wide onSubmit={(e) => soumettre(e)}>
        <PrestationFields />
      </FormModal>
      <FormModal open={!!edition} onOpenChange={(o) => !o && setEdition(null)} title="Modifier la prestation" submitLabel="Enregistrer" wide onSubmit={(e) => soumettre(e, edition)}>
        <PrestationFields prestation={edition ?? undefined} />
      </FormModal>

      <ConfirmDialog open={!!desactivation} onOpenChange={(o) => !o && setDesactivation(null)}
        titre="Désactiver cette prestation ?" description="Elle ne sera plus proposée dans les recommandations ni les devis."
        confirmLabel="Confirmer la désactivation"
        onConfirm={() => { if (desactivation) { updatePrestation(desactivation.id, { statut: "Désactivée" }); notify("Prestation désactivée."); } setDesactivation(null); }} />

      {detail && (
        <div className="drawer-backdrop" onMouseDown={() => setDetail(null)}>
          <aside className="detail-drawer" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-label={detail.nom}>
            <div className="drawer-head">
              <div><div><h2>{detail.nom}</h2><p>{detail.ville} · {detail.categorie}</p></div></div>
              <Button variant="ghost" size="icon" onClick={() => setDetail(null)} aria-label="Fermer">×</Button>
            </div>
            <img className="drawer-image" src={detail.image} alt={detail.nom} />
            <p className="drawer-note">{detail.description}</p>
            <div className="data-grid">
              <div><span>Prix</span><b>{euro(detail.prix)}</b></div>
              <div><span>Durée</span><b>{detail.duree}</b></div>
              <div><span>Capacité</span><b>{detail.capacite} personnes</b></div>
              <div><span>Disponibilité</span><b>{detail.disponibilite}</b></div>
            </div>
            <div className="drawer-actions">
              <Button variant="outline" onClick={() => { setEdition(detail); setDetail(null); }}>Modifier</Button>
              <Button variant="outline" onClick={() => navigate({ to: "/reservations", search: { nouveau: "1" } })}>Créer une réservation</Button>
              <Button variant="outline" onClick={() => navigate({ to: "/devis", search: { nouveau: "1" } })}>Ajouter au devis</Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function PrestationFields({ prestation }: { prestation?: Prestation }) {
  return (
    <>
      <Field label="Nom de la prestation" full><TextInput name="nom" required defaultValue={prestation?.nom} placeholder="Excursion désert Merzouga" /></Field>
      <Field label="Ville"><SelectInput name="ville" options={VILLES} defaultValue={prestation?.ville} /></Field>
      <Field label="Catégorie"><SelectInput name="categorie" options={CATEGORIES_PRESTATION} defaultValue={prestation?.categorie} /></Field>
      <Field label="Prix (€)"><TextInput type="number" min={0} step={10} name="prix" defaultValue={prestation?.prix ?? 200} /></Field>
      <Field label="Durée"><TextInput name="duree" defaultValue={prestation?.duree ?? "Journée"} placeholder="Journée, 2 nuits…" /></Field>
      <Field label="Capacité"><TextInput type="number" min={1} name="capacite" defaultValue={prestation?.capacite ?? 12} /></Field>
      <Field label="Disponibilité"><SelectInput name="disponibilite" options={DISPOS} defaultValue={prestation?.disponibilite} /></Field>
      <Field label="Mood"><SelectInput name="mood" options={MOODS} defaultValue={prestation?.moods[0]} /></Field>
      <Field label="Description" full><TextArea name="description" defaultValue={prestation?.description} placeholder="Ce que vit le client, les inclusions, les temps forts…" /></Field>
    </>
  );
}
