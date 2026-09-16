import { useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, Plus, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ActiveChips, ConfirmDialog, EmptyState, Field, FilterSelect, FormModal, Metric, Panel,
  RowMenu, SelectInput, StatutBadge, TextArea, TextInput,
} from "@/components/habti/ui-bits";
import { useHabti } from "@/lib/habti-store";
import {
  STATUTS_RESERVATION, VILLES, dateFr, euro, newId, type Reservation, type StatutReservation,
} from "@/lib/habti-data";

export function ReservationsView() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { statut?: string; nouveau?: string; id?: string; jour?: string };
  const { reservations, clients, prestations, employes, addReservation, updateReservation, addMission, notify } = useHabti();

  const [q, setQ] = useState("");
  const [ville, setVille] = useState("Tous");
  const [statut, setStatut] = useState(search.statut ?? "Tous");
  const [creation, setCreation] = useState(search.nouveau === "1");
  const [edition, setEdition] = useState<Reservation | null>(null);
  const [detail, setDetail] = useState<Reservation | null>(reservations.find((r) => r.id === search.id) ?? null);
  const [annulation, setAnnulation] = useState<Reservation | null>(null);

  const liste = useMemo(() => reservations.filter((r) => {
    if (q && !`${r.client} ${r.prestation} ${r.reference}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (ville !== "Tous" && r.ville !== ville) return false;
    if (statut !== "Tous" && r.statut !== statut) return false;
    if (search.jour && r.date !== search.jour) return false;
    return true;
  }), [reservations, q, ville, statut, search.jour]);

  const chips = [
    ville !== "Tous" && { label: "Ville", value: ville },
    statut !== "Tous" && { label: "Statut", value: statut },
    q && { label: "Recherche", value: q },
  ].filter(Boolean) as { label: string; value: string }[];
  const reset = () => { setQ(""); setVille("Tous"); setStatut("Tous"); };

  const soumettre = (e: React.FormEvent<HTMLFormElement>, existante?: Reservation | null) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const base = {
      client: String(f.get("client")), prestation: String(f.get("prestation")), ville: String(f.get("ville")),
      date: String(f.get("date")), heure: String(f.get("heure")), participants: Number(f.get("participants") || 1),
      tarif: Number(f.get("tarif") || 0), employe: String(f.get("employe")), notes: String(f.get("notes") ?? ""),
      statut: String(f.get("statut")) as StatutReservation,
    };
    if (existante) {
      updateReservation(existante.id, base);
      setEdition(null);
      notify("Modification enregistrée.");
      return;
    }
    const id = newId("R");
    addReservation({ ...base, id, reference: `RES-2026-${Math.floor(Math.random() * 900 + 100)}` });
    setCreation(false);
    notify("Réservation créée avec succès.");
  };

  const confirmer = (r: Reservation) => {
    updateReservation(r.id, { statut: "Confirmée" });
    addMission({
      id: newId("M"), titre: `Préparation ${r.prestation}`, client: r.client, activite: r.prestation,
      date: r.date, heure: r.heure, lieu: r.ville, employes: r.employe ? [r.employe] : [], statut: "Planifiée",
      checklist: [
        { id: newId("c"), label: "Confirmer la logistique transport", fait: false },
        { id: newId("c"), label: "Briefer l'équipe terrain", fait: false },
      ],
      notes: [],
    });
    notify("Réservation confirmée. Mission opérationnelle créée.");
  };

  return (
    <div className="module-stack">
      <div className="module-toolbar">
        <section className="metrics-grid metrics-3 grow">
          <Metric label="Réservations" value={String(reservations.length)} icon={CalendarDays} />
          <Metric label="Confirmées" value={String(reservations.filter((r) => r.statut === "Confirmée").length)} icon={CheckCircle2} />
          <Metric label="Participants attendus" value={String(reservations.reduce((s, r) => s + r.participants, 0))} icon={Users} tone="gold" />
        </section>
        <Button onClick={() => setCreation(true)}><Plus />Nouvelle réservation</Button>
      </div>

      <Panel className="crm-panel">
        <div className="smart-filter">
          <div><Search /><input placeholder="Rechercher une réservation…" value={q} onChange={(e) => setQ(e.currentTarget.value)} /></div>
          <FilterSelect label="Ville" value={ville} options={VILLES} onChange={setVille} />
          <FilterSelect label="Statut" value={statut} options={STATUTS_RESERVATION} onChange={setStatut} />
        </div>
        <ActiveChips chips={chips} onClear={reset} onRemove={(l) => { if (l === "Ville") setVille("Tous"); if (l === "Statut") setStatut("Tous"); if (l === "Recherche") setQ(""); }} />

        {liste.length === 0 ? (
          <EmptyState titre="Aucune réservation ne correspond à vos filtres."
            description="Créez une réservation ou réinitialisez les critères." ctaLabel="Créer une réservation"
            onCta={() => setCreation(true)} icon={CalendarDays} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Référence</th><th>Client</th><th>Prestation</th><th>Date</th><th>Participants</th><th>Tarif</th><th>Statut</th><th /></tr></thead>
              <tbody>
                {liste.map((r) => (
                  <tr key={r.id} onClick={() => setDetail(r)}>
                    <td><b>{r.reference}</b></td>
                    <td>{r.client}</td>
                    <td><div><b>{r.prestation}</b><span>{r.ville} · {r.employe}</span></div></td>
                    <td>{dateFr(r.date)} · {r.heure}</td>
                    <td>{r.participants}</td>
                    <td><b>{euro(r.tarif)}</b></td>
                    <td><StatutBadge statut={r.statut} /></td>
                    <td>
                      <RowMenu actions={[
                        { label: "Voir", onSelect: () => setDetail(r) },
                        { label: "Modifier", onSelect: () => setEdition(r) },
                        { label: "Confirmer", onSelect: () => confirmer(r) },
                        { label: "Affecter", onSelect: () => navigate({ to: "/employes" }) },
                        { label: "Créer un devis", onSelect: () => navigate({ to: "/devis", search: { nouveau: "1" } }) },
                        { label: "Voir le client", onSelect: () => navigate({ to: "/clients" }) },
                        { label: "Annuler", danger: true, onSelect: () => setAnnulation(r) },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <FormModal open={creation} onOpenChange={setCreation} title="Nouvelle réservation" submitLabel="Confirmer la réservation" wide
        onSubmit={(e) => soumettre(e)}>
        <ReservationFields clients={clients.map((c) => c.nom)} prestations={prestations.map((p) => p.nom)} employes={employes.map((e) => e.nom)} />
      </FormModal>

      <FormModal open={!!edition} onOpenChange={(o) => !o && setEdition(null)} title="Modifier la réservation" submitLabel="Enregistrer" wide
        onSubmit={(e) => soumettre(e, edition)}>
        <ReservationFields reservation={edition ?? undefined} clients={clients.map((c) => c.nom)} prestations={prestations.map((p) => p.nom)} employes={employes.map((e) => e.nom)} />
      </FormModal>

      <ConfirmDialog open={!!annulation} onOpenChange={(o) => !o && setAnnulation(null)}
        titre="Êtes-vous sûr de vouloir annuler cette réservation ?" confirmLabel="Confirmer l'annulation"
        onConfirm={() => { if (annulation) { updateReservation(annulation.id, { statut: "Annulée" }); notify("Réservation annulée."); } setAnnulation(null); }} />

      {detail && (
        <div className="drawer-backdrop" onMouseDown={() => setDetail(null)}>
          <aside className="detail-drawer" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-label={`Réservation ${detail.reference}`}>
            <div className="drawer-head">
              <div><div><h2>{detail.prestation}</h2><p>{detail.reference} · {detail.client}</p></div></div>
              <Button variant="ghost" size="icon" onClick={() => setDetail(null)} aria-label="Fermer">×</Button>
            </div>
            <div className="data-grid">
              <div><span>Date</span><b>{dateFr(detail.date)} à {detail.heure}</b></div>
              <div><span>Ville</span><b>{detail.ville}</b></div>
              <div><span>Participants</span><b>{detail.participants}</b></div>
              <div><span>Tarif</span><b>{euro(detail.tarif)}</b></div>
              <div><span>Employé responsable</span><b>{detail.employe || "Non affecté"}</b></div>
              <div><span>Statut</span><b>{detail.statut}</b></div>
            </div>
            <p className="drawer-note">{detail.notes || "Aucune note opérationnelle."}</p>
            <div className="drawer-actions">
              <Button variant="outline" onClick={() => { setEdition(detail); setDetail(null); }}>Modifier</Button>
              <Button variant="outline" onClick={() => confirmer(detail)}>Confirmer</Button>
              <Button variant="outline" onClick={() => navigate({ to: "/planning" })}>Voir dans le planning</Button>
              <Button variant="outline" onClick={() => navigate({ to: "/devis", search: { nouveau: "1" } })}>Créer un devis</Button>
              <Button variant="outline" onClick={() => setAnnulation(detail)}>Annuler</Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function ReservationFields({ reservation, clients, prestations, employes }: {
  reservation?: Reservation; clients: string[]; prestations: string[]; employes: string[];
}) {
  return (
    <>
      <Field label="Client"><SelectInput name="client" options={clients.length ? clients : ["Nouveau client"]} defaultValue={reservation?.client} /></Field>
      <Field label="Activité / voyage / événement"><SelectInput name="prestation" options={prestations} defaultValue={reservation?.prestation} /></Field>
      <Field label="Ville"><SelectInput name="ville" options={VILLES} defaultValue={reservation?.ville} /></Field>
      <Field label="Date"><TextInput type="date" name="date" required defaultValue={reservation?.date ?? "2026-09-20"} /></Field>
      <Field label="Horaire"><TextInput type="time" name="heure" required defaultValue={reservation?.heure ?? "09:00"} /></Field>
      <Field label="Nombre de participants"><TextInput type="number" min={1} name="participants" defaultValue={reservation?.participants ?? 2} /></Field>
      <Field label="Tarif (€)"><TextInput type="number" min={0} step={50} name="tarif" defaultValue={reservation?.tarif ?? 500} /></Field>
      <Field label="Employé responsable"><SelectInput name="employe" options={employes} defaultValue={reservation?.employe} /></Field>
      <Field label="Statut"><SelectInput name="statut" options={STATUTS_RESERVATION} defaultValue={reservation?.statut ?? "Demande reçue"} /></Field>
      <Field label="Notes" full><TextArea name="notes" defaultValue={reservation?.notes} placeholder="Contraintes, régimes alimentaires, logistique…" /></Field>
    </>
  );
}
