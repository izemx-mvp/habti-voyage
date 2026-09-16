import { useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { BriefcaseBusiness, MapPin, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  EmptyState, Field, FilterSelect, FormModal, Panel, SelectInput, StatutBadge, TextArea, TextInput,
} from "@/components/habti/ui-bits";
import { useHabti } from "@/lib/habti-store";
import { STATUTS_MISSION, VILLES, dateFr, newId, type Mission, type StatutMission } from "@/lib/habti-data";

export function MissionsView() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { nouveau?: string; id?: string; statut?: string };
  const { missions, employes, clients, prestations, addMission, updateMission, toggleChecklist, notify } = useHabti();

  const [q, setQ] = useState("");
  const [statut, setStatut] = useState(search.statut ?? "Tous");
  const [creation, setCreation] = useState(search.nouveau === "1");
  const [edition, setEdition] = useState<Mission | null>(null);
  const [note, setNote] = useState("");
  const [ouverte, setOuverte] = useState<string | null>(search.id ?? missions[0]?.id ?? null);

  const liste = useMemo(() => missions.filter((m) => {
    if (q && !`${m.titre} ${m.client} ${m.lieu}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (statut !== "Tous" && m.statut !== statut) return false;
    return true;
  }), [missions, q, statut]);

  const active = missions.find((m) => m.id === ouverte) ?? liste[0] ?? null;

  const soumettre = (e: React.FormEvent<HTMLFormElement>, existante?: Mission | null) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const base = {
      titre: String(f.get("titre")), client: String(f.get("client")), activite: String(f.get("activite")),
      date: String(f.get("date")), heure: String(f.get("heure")), lieu: String(f.get("lieu")),
      employes: [String(f.get("employe"))].filter(Boolean), statut: String(f.get("statut")) as StatutMission,
    };
    if (existante) { updateMission(existante.id, base); setEdition(null); notify("Modification enregistrée."); return; }
    const id = newId("M");
    addMission({
      ...base, id, notes: [],
      checklist: String(f.get("checklist") ?? "").split("\n").filter(Boolean).map((label) => ({ id: newId("c"), label, fait: false })),
    });
    setOuverte(id);
    setCreation(false);
    notify("Mission créée avec succès.");
  };

  return (
    <div className="module-stack">
      <div className="module-toolbar">
        <div className="smart-filter grow">
          <div><Search /><input placeholder="Rechercher une mission…" value={q} onChange={(e) => setQ(e.currentTarget.value)} /></div>
          <FilterSelect label="Statut" value={statut} options={STATUTS_MISSION} onChange={setStatut} />
        </div>
        <Button onClick={() => setCreation(true)}><Plus />Nouvelle mission</Button>
      </div>

      {liste.length === 0 ? (
        <Panel><EmptyState titre="Aucune mission ne correspond à vos filtres." ctaLabel="Créer une mission" onCta={() => setCreation(true)} icon={BriefcaseBusiness} /></Panel>
      ) : (
        <div className="mission-layout">
          <div className="mission-list">
            {liste.map((m) => (
              <button key={m.id} className={`mission-card ${active?.id === m.id ? "active" : ""}`} onClick={() => setOuverte(m.id)}>
                <div className="mission-card-head"><b>{m.titre}</b><StatutBadge statut={m.statut} /></div>
                <span>{m.client} · {m.activite}</span>
                <span><MapPin />{m.lieu} · {dateFr(m.date)} à {m.heure}</span>
                <Progress value={Math.round((m.checklist.filter((c) => c.fait).length / (m.checklist.length || 1)) * 100)} />
              </button>
            ))}
          </div>

          {active && (
            <Panel className="mission-detail">
              <div className="panel-title">
                <div><h3>{active.titre}</h3><p>{active.client} · {active.activite}</p></div>
                <StatutBadge statut={active.statut} />
              </div>
              <div className="data-grid">
                <div><span>Date</span><b>{dateFr(active.date)} à {active.heure}</b></div>
                <div><span>Lieu</span><b>{active.lieu}</b></div>
                <div><span>Équipe affectée</span><b>{active.employes.join(", ") || "Non affectée"}</b></div>
                <div><span>Avancement</span><b>{active.checklist.filter((c) => c.fait).length}/{active.checklist.length}</b></div>
              </div>

              <h4 className="block-title">Checklist opérationnelle</h4>
              <div className="checklist">
                {active.checklist.map((c) => (
                  <label key={c.id}>
                    <input type="checkbox" checked={c.fait} onChange={() => toggleChecklist(active.id, c.id)} />
                    <span className={c.fait ? "done" : ""}>{c.label}</span>
                  </label>
                ))}
                {active.checklist.length === 0 && <p className="muted-line">Aucune tâche pour le moment.</p>}
              </div>

              <h4 className="block-title">Commentaires internes</h4>
              <form className="note-form" onSubmit={(e) => {
                e.preventDefault();
                if (!note.trim()) return;
                updateMission(active.id, { notes: [{ id: newId("n"), texte: note.trim(), date: new Date().toLocaleString("fr-FR"), auteur: "Salma Bennani" }, ...active.notes] });
                setNote("");
                notify("Note ajoutée à la mission.");
              }}>
                <input className="habti-input" placeholder="Ajouter une note…" value={note} onChange={(e) => setNote(e.currentTarget.value)} />
                <Button type="submit" disabled={!note.trim()}>Ajouter une note</Button>
              </form>
              <div className="mini-timeline">
                {active.notes.map((n) => <p key={n.id}><i />{n.texte} <span>{n.date}</span></p>)}
              </div>

              <div className="drawer-actions">
                <Button variant="outline" onClick={() => { updateMission(active.id, { statut: "Affectée" }); notify("Mission affectée."); }}>Affecter</Button>
                <Button variant="outline" onClick={() => setEdition(active)}>Modifier</Button>
                <Button variant="outline" onClick={() => { updateMission(active.id, { statut: "En cours" }); notify("Mission démarrée."); }}>Démarrer</Button>
                <Button variant="outline" onClick={() => { updateMission(active.id, { statut: "Terminée" }); notify("Mission terminée."); }}>Terminer</Button>
                <Button variant="outline" onClick={() => navigate({ to: "/reservations" })}>Voir la réservation</Button>
              </div>
            </Panel>
          )}
        </div>
      )}

      <FormModal open={creation} onOpenChange={setCreation} title="Nouvelle mission" submitLabel="Créer la mission" wide onSubmit={(e) => soumettre(e)}>
        <MissionFields employes={employes.map((e) => e.nom)} clients={clients.map((c) => c.nom)} prestations={prestations.map((p) => p.nom)} />
      </FormModal>
      <FormModal open={!!edition} onOpenChange={(o) => !o && setEdition(null)} title="Modifier la mission" submitLabel="Enregistrer" wide onSubmit={(e) => soumettre(e, edition)}>
        <MissionFields mission={edition ?? undefined} employes={employes.map((e) => e.nom)} clients={clients.map((c) => c.nom)} prestations={prestations.map((p) => p.nom)} />
      </FormModal>
    </div>
  );
}

function MissionFields({ mission, employes, clients, prestations }: { mission?: Mission | undefined; employes: string[]; clients: string[]; prestations: string[] }) {
  return (
    <>
      <Field label="Titre de la mission" full><TextInput name="titre" required defaultValue={mission?.titre} placeholder="Installation campement Agafay" /></Field>
      <Field label="Client"><SelectInput name="client" options={clients} defaultValue={mission?.client} /></Field>
      <Field label="Activité"><SelectInput name="activite" options={prestations} defaultValue={mission?.activite} /></Field>
      <Field label="Date"><TextInput type="date" name="date" required defaultValue={mission?.date ?? "2026-09-20"} /></Field>
      <Field label="Horaire"><TextInput type="time" name="heure" required defaultValue={mission?.heure ?? "09:00"} /></Field>
      <Field label="Lieu"><SelectInput name="lieu" options={VILLES} defaultValue={mission?.lieu} /></Field>
      <Field label="Employé affecté"><SelectInput name="employe" options={employes} defaultValue={mission?.employes[0]} /></Field>
      <Field label="Statut"><SelectInput name="statut" options={STATUTS_MISSION} defaultValue={mission?.statut ?? "À planifier"} /></Field>
      {!mission && <Field label="Checklist (une tâche par ligne)" full><TextArea name="checklist" placeholder={"Réserver les 4x4\nConfirmer le guide local"} /></Field>}
    </>
  );
}
