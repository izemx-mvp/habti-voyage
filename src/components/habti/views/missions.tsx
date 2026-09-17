import { useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { BriefcaseBusiness, MapPin, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  EmptyState, Field, FilterSelect, FormModal, Metric, Panel, SelectInput, StatutBadge, TextArea, TextInput,
} from "@/components/habti/ui-bits";
import { useHabti } from "@/lib/habti-store";
import { STATUTS_MISSION, VILLES, dateFr, newId, type Mission, type StatutMission } from "@/lib/habti-data";

export function MissionsView() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { nouveau?: string; statut?: string };
  const { missions, employes, clients, prestations, addMission, updateMission, notify } = useHabti();

  const [q, setQ] = useState("");
  const [statut, setStatut] = useState(search.statut ?? "Tous");
  const [creation, setCreation] = useState(search.nouveau === "1");
  const [edition, setEdition] = useState<Mission | null>(null);

  const liste = useMemo(() => missions.filter((m) => {
    if (q && !`${m.titre} ${m.client} ${m.lieu} ${m.activite}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (statut !== "Tous" && m.statut !== statut) return false;
    return true;
  }), [missions, q, statut]);

  const aPlanifier = missions.filter((m) => m.statut === "À planifier").length;
  const enCours = missions.filter((m) => ["Planifiée", "Affectée", "En cours"].includes(m.statut)).length;
  const terminees = missions.filter((m) => m.statut === "Terminée").length;

  const soumettre = (e: React.FormEvent<HTMLFormElement>, existante?: Mission | null) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const base = {
      titre: String(f.get("titre")), client: String(f.get("client")), activite: String(f.get("activite")),
      date: String(f.get("date")), heure: String(f.get("heure")), lieu: String(f.get("lieu")),
      employes: [String(f.get("employe"))].filter(Boolean), statut: String(f.get("statut")) as StatutMission,
    };
    if (existante) { updateMission(existante.id, base); setEdition(null); notify("Opération mise à jour."); return; }
    const id = newId("M");
    addMission({
      ...base, id, notes: [],
      checklist: String(f.get("checklist") ?? "").split("\n").filter(Boolean).map((label) => ({ id: newId("c"), label, fait: false })),
    });
    setCreation(false);
    notify("Opération créée avec succès.");
    navigate({ to: "/operations/$id", params: { id } });
  };

  return (
    <div className="module-stack">
      <section className="metrics-grid metrics-4">
        <Metric label="Opérations" value={String(missions.length)} icon={BriefcaseBusiness} />
        <Metric label="À planifier" value={String(aPlanifier)} icon={Plus} />
        <Metric label="En cours" value={String(enCours)} icon={MapPin} tone="gold" />
        <Metric label="Terminées" value={String(terminees)} icon={BriefcaseBusiness} />
      </section>

      <div className="module-toolbar">
        <div className="smart-filter grow">
          <div><Search /><input placeholder="Rechercher une opération…" value={q} onChange={(e) => setQ(e.currentTarget.value)} /></div>
          <FilterSelect label="Statut" value={statut} options={STATUTS_MISSION} onChange={setStatut} />
        </div>
        <Button onClick={() => setCreation(true)}><Plus />Nouvelle opération</Button>
      </div>

      {liste.length === 0 ? (
        <Panel><EmptyState titre="Aucune opération ne correspond à vos filtres." ctaLabel="Créer une opération" onCta={() => setCreation(true)} icon={BriefcaseBusiness} /></Panel>
      ) : (
        <div className="operation-grid">
          {liste.map((m) => {
            const done = m.checklist.filter((c) => c.fait).length;
            const progress = Math.round((done / (m.checklist.length || 1)) * 100);
            return (
              <Panel className="operation-card" key={m.id}>
                <button className="operation-main" onClick={() => navigate({ to: "/operations/$id", params: { id: m.id } })}>
                  <div className="mission-card-head"><b>{m.titre}</b><StatutBadge statut={m.statut} /></div>
                  <span>{m.client} · {m.activite}</span>
                  <span><MapPin />{m.lieu} · {dateFr(m.date)} à {m.heure}</span>
                  <Progress value={progress} />
                  <small>{done}/{m.checklist.length} tâches validées · {m.employes.join(", ") || "Équipe à affecter"}</small>
                </button>
                <div className="card-actions">
                  <Button size="sm" variant="outline" onClick={() => setEdition(m)}>Modifier</Button>
                  <Button size="sm" variant="outline" onClick={() => { updateMission(m.id, { statut: "En cours" }); notify("Opération démarrée."); }}>Démarrer</Button>
                  <Button size="sm" onClick={() => navigate({ to: "/operations/$id", params: { id: m.id } })}>Ouvrir</Button>
                </div>
              </Panel>
            );
          })}
        </div>
      )}

      <FormModal open={creation} onOpenChange={setCreation} title="Nouvelle opération" submitLabel="Créer l'opération" wide onSubmit={(e) => soumettre(e)}>
        <MissionFields employes={employes.map((e) => e.nom)} clients={clients.map((c) => c.nom)} prestations={prestations.map((p) => p.nom)} />
      </FormModal>
      <FormModal open={!!edition} onOpenChange={(o) => !o && setEdition(null)} title="Modifier l’opération" submitLabel="Enregistrer" wide onSubmit={(e) => soumettre(e, edition)}>
        <MissionFields mission={edition ?? undefined} employes={employes.map((e) => e.nom)} clients={clients.map((c) => c.nom)} prestations={prestations.map((p) => p.nom)} />
      </FormModal>
    </div>
  );
}

function MissionFields({ mission, employes, clients, prestations }: { mission?: Mission | undefined; employes: string[]; clients: string[]; prestations: string[] }) {
  return (
    <>
      <Field label="Titre de l’opération" full><TextInput name="titre" required defaultValue={mission?.titre} placeholder="Installation campement Agafay" /></Field>
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
