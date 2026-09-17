import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Search, UsersRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  EmptyState, Field, FilterSelect, FormModal, Panel, PanelTitle, SelectInput, StatutBadge, TextInput,
} from "@/components/habti/ui-bits";
import { useHabti } from "@/lib/habti-store";
import { VILLES, dateFr, newId, type Employe } from "@/lib/habti-data";

const DISPOS = ["Disponible", "En mission", "Congé"] as const;
const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export function EmployesView() {
  const navigate = useNavigate();
  const { employes, missions, addEmploye, updateEmploye, notify } = useHabti();
  const [q, setQ] = useState("");
  const [ville, setVille] = useState("Tous");
  const [dispo, setDispo] = useState("Tous");
  const [creation, setCreation] = useState(false);
  const [edition, setEdition] = useState<Employe | null>(null);

  const liste = useMemo(() => employes.filter((e) => {
    if (q && !`${e.nom} ${e.role} ${e.specialites.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (ville !== "Tous" && e.ville !== ville) return false;
    if (dispo !== "Tous" && e.disponibilite !== dispo) return false;
    return true;
  }), [employes, q, ville, dispo]);

  const soumettre = (e: React.FormEvent<HTMLFormElement>, existant?: Employe | null) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const nom = String(f.get("nom"));
    const base = {
      nom, role: String(f.get("role")), ville: String(f.get("ville")),
      specialites: String(f.get("specialites") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
      disponibilite: String(f.get("disponibilite")) as Employe["disponibilite"],
    };
    if (existant) { updateEmploye(existant.id, base); setEdition(null); notify("Modification enregistrée."); return; }
    addEmploye({ ...base, id: newId("E"), missions: 0, charge: 0, initiales: nom.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() });
    setCreation(false);
    notify("Employé ajouté avec succès.");
  };

  return (
    <div className="module-stack">
      <div className="module-toolbar">
        <div className="smart-filter grow">
          <div><Search /><input placeholder="Rechercher un employé…" value={q} onChange={(e) => setQ(e.currentTarget.value)} /></div>
          <FilterSelect label="Ville" value={ville} options={VILLES} onChange={setVille} />
          <FilterSelect label="Disponibilité" value={dispo} options={DISPOS} onChange={setDispo} />
        </div>
        <Button onClick={() => setCreation(true)}><Plus />Ajouter un employé</Button>
      </div>

      {liste.length === 0 ? (
        <Panel><EmptyState titre="Aucun employé ne correspond à vos filtres." ctaLabel="Ajouter un employé" onCta={() => setCreation(true)} icon={UsersRound} /></Panel>
      ) : (
        <div className="employee-grid">
          {liste.map((e) => (
            <Panel className="employee-card" key={e.id}>
              <div className="employee-head">
                <Avatar><AvatarFallback>{e.initiales}</AvatarFallback></Avatar>
                <div><b>{e.nom}</b><span>{e.role}</span></div>
                <StatutBadge statut={e.disponibilite} />
              </div>
              <p className="employee-meta">{e.ville} · {e.missions} missions affectées</p>
              <div className="tag-row">{e.specialites.map((s) => <span className="mini-tag" key={s}>{s}</span>)}</div>
              <div className="capacity">
                <div><span>Charge de travail</span><b>{e.charge} %</b></div>
                <Progress value={e.charge} />
              </div>
              <div className="card-actions">
                <Button variant="outline" size="sm" onClick={() => navigate({ to: "/employes/$id", params: { id: e.id } })}>Voir le profil</Button>
                <Button variant="outline" size="sm" onClick={() => setEdition(e)}>Modifier</Button>
                <Button size="sm" onClick={() => navigate({ to: "/operations", search: { nouveau: "1" } })}>Affecter</Button>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <FormModal open={creation} onOpenChange={setCreation} title="Ajouter un employé" submitLabel="Ajouter" onSubmit={(e) => soumettre(e)}>
        <EmployeFields />
      </FormModal>
      <FormModal open={!!edition} onOpenChange={(o) => !o && setEdition(null)} title="Modifier l'employé" submitLabel="Enregistrer" onSubmit={(e) => soumettre(e, edition)}>
        <EmployeFields employe={edition ?? undefined} />
      </FormModal>


      <Panel>
        <PanelTitle title="Vue de charge hebdomadaire" subtitle="Répartition du travail sur l'équipe" />
        {employes.map((e) => (
          <div className="charge-row" key={e.id}>
            <span>{e.nom}</span>
            <Progress value={e.charge} />
            <b>{e.charge} %</b>
          </div>
        ))}
      </Panel>
    </div>
  );
}

function EmployeFields({ employe }: { employe?: Employe | undefined }) {
  return (
    <>
      <Field label="Nom complet" full><TextInput name="nom" required defaultValue={employe?.nom} placeholder="Youssef Amrani" /></Field>
      <Field label="Rôle"><TextInput name="role" required defaultValue={employe?.role} placeholder="Guide désert senior" /></Field>
      <Field label="Ville"><SelectInput name="ville" options={VILLES} defaultValue={employe?.ville} /></Field>
      <Field label="Disponibilité"><SelectInput name="disponibilite" options={DISPOS} defaultValue={employe?.disponibilite} /></Field>
      <Field label="Spécialités (séparées par des virgules)" full><TextInput name="specialites" defaultValue={employe?.specialites.join(", ")} placeholder="Désert, 4x4, Bivouac" /></Field>
    </>
  );
}
