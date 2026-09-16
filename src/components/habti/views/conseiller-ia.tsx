import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  EmptyState, Field, Panel, PanelTitle, SelectInput, StatutBadge, TextInput,
} from "@/components/habti/ui-bits";
import { useHabti } from "@/lib/habti-store";
import { MOODS, VILLES, euro, type Prestation } from "@/lib/habti-data";

const TYPES_CLIENT = ["Particulier", "Couple", "Famille", "Groupe", "Entreprise"];

export function ConseillerIAView() {
  const navigate = useNavigate();
  const { prestations, clients, notify } = useHabti();
  const [ville, setVille] = useState<string>("Marrakech");
  const [date, setDate] = useState("2026-10-12");
  const [budget, setBudget] = useState(4000);
  const [personnes, setPersonnes] = useState(4);
  const [typeClient, setTypeClient] = useState("Famille");
  const [mood, setMood] = useState<string>("Aventure");
  const [interet, setInteret] = useState("Excursion");
  const [resultats, setResultats] = useState<{ p: Prestation; score: number; pourquoi: string }[] | null>(null);
  const [selection, setSelection] = useState<string[]>([]);
  const [comparaison, setComparaison] = useState(false);
  const [detail, setDetail] = useState<Prestation | null>(null);

  const generer = () => {
    const scored = prestations
      .filter((p) => p.statut === "Active")
      .map((p) => {
        let score = 45;
        if (p.ville === ville) score += 25;
        if (p.moods.includes(mood)) score += 18;
        if (p.prix * personnes <= budget) score += 12;
        if (p.nom.toLowerCase().includes(interet.toLowerCase())) score += 8;
        if (p.capacite >= personnes) score += 5;
        const raisons = [
          p.ville === ville ? `située à ${p.ville}` : "accessible depuis votre ville de séjour",
          p.moods.includes(mood) ? `parfaitement alignée avec une ambiance « ${mood} »` : "appréciée pour sa polyvalence",
          p.prix * personnes <= budget ? "compatible avec votre budget global" : "option premium légèrement au-dessus du budget",
        ];
        return { p, score: Math.min(98, score), pourquoi: `Recommandée car ${raisons.join(", ")}, pour un groupe de ${personnes} personnes (${typeClient.toLowerCase()}).` };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
    setResultats(scored);
    notify("Suggestions générées par le conseiller IA.");
  };

  const basculerSelection = (id: string) =>
    setSelection((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="module-stack">
      <Panel>
        <PanelTitle title="Brief client" subtitle="Renseignez le contexte, l'IA propose les expériences les plus pertinentes" />
        <div className="form-grid">
          <Field label="Ville"><SelectInput value={ville} options={VILLES} onChange={(e) => setVille(e.currentTarget.value)} /></Field>
          <Field label="Date souhaitée"><TextInput type="date" value={date} onChange={(e) => setDate(e.currentTarget.value)} /></Field>
          <Field label="Budget global (€)"><TextInput type="number" min={0} step={100} value={budget} onChange={(e) => setBudget(Number(e.currentTarget.value))} /></Field>
          <Field label="Nombre de personnes"><TextInput type="number" min={1} value={personnes} onChange={(e) => setPersonnes(Number(e.currentTarget.value))} /></Field>
          <Field label="Type de client"><SelectInput value={typeClient} options={TYPES_CLIENT} onChange={(e) => setTypeClient(e.currentTarget.value)} /></Field>
          <Field label="Mood"><SelectInput value={mood} options={MOODS} onChange={(e) => setMood(e.currentTarget.value)} /></Field>
          <Field label="Centre d'intérêt" full><TextInput value={interet} onChange={(e) => setInteret(e.currentTarget.value)} placeholder="Désert, gastronomie, montgolfière…" /></Field>
        </div>
        <div className="drawer-actions">
          <Button variant="outline" onClick={() => { setResultats(null); setSelection([]); }}>Réinitialiser</Button>
          <Button onClick={generer}><Sparkles />Générer des suggestions</Button>
        </div>
      </Panel>

      {resultats === null ? (
        <Panel><EmptyState titre="Aucune suggestion pour le moment." description="Complétez le brief client puis lancez la génération." ctaLabel="Générer des suggestions" onCta={generer} icon={Sparkles} /></Panel>
      ) : resultats.length === 0 ? (
        <Panel><EmptyState titre="Aucune prestation ne correspond à ce brief." ctaLabel="Voir le catalogue" onCta={() => navigate({ to: "/catalogue" })} icon={Sparkles} /></Panel>
      ) : (
        <div className="suggestion-grid">
          {resultats.map(({ p, score, pourquoi }) => (
            <Panel className="suggestion-card" key={p.id}>
              <div className="suggestion-image"><img src={p.image} alt={p.nom} loading="lazy" /><StatutBadge statut={p.statut} /></div>
              <h3>{p.nom}</h3>
              <p className="employee-meta">{p.ville} · {p.categorie} · {p.duree}</p>
              <div className="data-grid compact">
                <div><span>Prix / personne</span><b>{euro(p.prix)}</b></div>
                <div><span>Disponibilité</span><b>{p.disponibilite}</b></div>
              </div>
              <div className="capacity">
                <div><span>Score de correspondance</span><b>{score} %</b></div>
                <Progress value={score} />
              </div>
              <div className="ia-summary"><h4><Sparkles />Pourquoi cette recommandation</h4><p>{pourquoi}</p></div>
              <div className="card-actions">
                <Button variant="outline" size="sm" onClick={() => setDetail(p)}>Voir l'activité</Button>
                <Button variant="outline" size="sm" onClick={() => { basculerSelection(p.id); notify(selection.includes(p.id) ? "Retirée de la sélection." : "Ajoutée à la sélection."); }}>
                  {selection.includes(p.id) ? "Retirer" : "Ajouter à la sélection"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => { setComparaison(true); notify("Comparaison ouverte."); }}>Comparer</Button>
                <Button variant="outline" size="sm" onClick={() => notify(`Proposition « ${p.nom} » envoyée au client.`)}>Proposer au client</Button>
                <Button variant="outline" size="sm" onClick={() => navigate({ to: "/devis", search: { nouveau: "1" } })}>Ajouter au devis</Button>
                <Button size="sm" onClick={() => navigate({ to: "/reservations", search: { nouveau: "1" } })}>Réserver</Button>
              </div>
            </Panel>
          ))}
        </div>
      )}

      {selection.length > 0 && (
        <div className="compare-dock">
          <span>{selection.length} prestation(s) sélectionnée(s)</span>
          <Button variant="outline" size="sm" onClick={() => setComparaison(true)}>Comparer</Button>
          <Button variant="outline" size="sm" onClick={() => notify(`Sélection proposée à ${clients[0]?.nom ?? "votre client"}.`)}>Proposer au client</Button>
          <Button variant="ghost" size="sm" onClick={() => setSelection([])}>Vider la sélection</Button>
        </div>
      )}

      {comparaison && (
        <div className="drawer-backdrop" onMouseDown={() => setComparaison(false)}>
          <section className="builder-panel" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-label="Comparaison des prestations">
            <div className="drawer-head">
              <div><div><h2>Comparaison</h2><p>Vue côte à côte des prestations sélectionnées</p></div></div>
              <Button variant="ghost" size="icon" aria-label="Fermer" onClick={() => setComparaison(false)}>×</Button>
            </div>
            {selection.length === 0 ? (
              <EmptyState titre="Aucune prestation sélectionnée." description="Ajoutez des prestations à la sélection pour les comparer." />
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Prestation</th><th>Ville</th><th>Durée</th><th>Capacité</th><th>Prix</th><th>Total groupe</th></tr></thead>
                  <tbody>
                    {prestations.filter((p) => selection.includes(p.id)).map((p) => (
                      <tr key={p.id}><td><b>{p.nom}</b></td><td>{p.ville}</td><td>{p.duree}</td><td>{p.capacite}</td><td>{euro(p.prix)}</td><td><b>{euro(p.prix * personnes)}</b></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      {detail && (
        <div className="drawer-backdrop" onMouseDown={() => setDetail(null)}>
          <aside className="detail-drawer" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-label={detail.nom}>
            <div className="drawer-head">
              <div><div><h2>{detail.nom}</h2><p>{detail.ville} · {detail.categorie}</p></div></div>
              <Button variant="ghost" size="icon" aria-label="Fermer" onClick={() => setDetail(null)}>×</Button>
            </div>
            <img className="drawer-image" src={detail.image} alt={detail.nom} />
            <p>{detail.description}</p>
            <div className="data-grid">
              <div><span>Durée</span><b>{detail.duree}</b></div>
              <div><span>Capacité</span><b>{detail.capacite} personnes</b></div>
              <div><span>Prix</span><b>{euro(detail.prix)}</b></div>
              <div><span>Disponibilité</span><b>{detail.disponibilite}</b></div>
            </div>
            <div className="drawer-actions">
              <Button variant="outline" onClick={() => navigate({ to: "/catalogue", search: { id: detail.id } })}>Ouvrir dans le catalogue</Button>
              <Button onClick={() => navigate({ to: "/reservations", search: { nouveau: "1" } })}>Réserver</Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
