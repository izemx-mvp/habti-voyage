import { useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { CreditCard, Plus, Search, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  EmptyState, Field, FilterSelect, FormModal, Metric, Panel, RowMenu, SelectInput, StatutBadge, TextArea, TextInput,
} from "@/components/habti/ui-bits";
import { useHabti } from "@/lib/habti-store";
import {
  MODES_PAIEMENT, STATUTS_PAIEMENT, TYPES_PAIEMENT, dateFr, euro, newId, type StatutPaiement,
} from "@/lib/habti-data";

export function PaiementsView() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { statut?: string; nouveau?: string };
  const { paiements, clients, reservations, addPaiement, notify } = useHabti();
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState(search.statut ?? "Tous");
  const [creation, setCreation] = useState(search.nouveau === "1");
  const [montantTotal, setMontantTotal] = useState(2000);
  const [montantPaye, setMontantPaye] = useState(500);

  const liste = useMemo(() => paiements.filter((p) => {
    if (q && !`${p.reference} ${p.client} ${p.rattachement}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (statut !== "Tous" && p.statut !== statut) return false;
    return true;
  }), [paiements, q, statut]);

  const encaisse = paiements.reduce((s, p) => s + p.montantPaye, 0);
  const reste = paiements.reduce((s, p) => s + (p.montantTotal - p.montantPaye), 0);

  const statutAuto = (total: number, paye: number, type: string): StatutPaiement => {
    if (type === "Remboursement") return "Remboursé";
    if (paye <= 0) return "Non payé";
    if (paye >= total) return "Payé";
    return type === "Acompte" ? "Acompte reçu" : "Partiellement payé";
  };

  return (
    <div className="module-stack">
      <div className="module-toolbar">
        <section className="metrics-grid metrics-3 grow">
          <Metric label="Déjà encaissé" value={euro(encaisse)} icon={Wallet} />
          <Metric label="Reste à payer" value={euro(reste)} icon={CreditCard} tone="gold" />
          <Metric label="Paiements en retard" value={String(paiements.filter((p) => p.statut === "En retard").length)} icon={CreditCard} />
        </section>
        <Button onClick={() => setCreation(true)}><Plus />Enregistrer un paiement</Button>
      </div>

      <Panel className="crm-panel">
        <div className="smart-filter">
          <div><Search /><input placeholder="Rechercher un paiement…" value={q} onChange={(e) => setQ(e.currentTarget.value)} /></div>
          <FilterSelect label="Statut" value={statut} options={STATUTS_PAIEMENT} onChange={setStatut} />
          <Button variant="ghost" onClick={() => { setQ(""); setStatut("Tous"); }}>Réinitialiser</Button>
        </div>
        {liste.length === 0 ? (
          <EmptyState titre="Aucun paiement ne correspond à vos filtres." ctaLabel="Enregistrer un paiement" onCta={() => setCreation(true)} icon={CreditCard} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Référence</th><th>Client</th><th>Rattachement</th><th>Montant</th><th>Avancement</th><th>Mode</th><th>Statut</th><th /></tr></thead>
              <tbody>
                {liste.map((p) => (
                  <tr key={p.id}>
                    <td><b>{p.reference}</b><span>{dateFr(p.date)}</span></td>
                    <td>{p.client}</td>
                    <td>{p.rattachement}</td>
                    <td><b>{euro(p.montantPaye)}</b><span>sur {euro(p.montantTotal)}</span></td>
                    <td><div className="score"><span>{Math.round((p.montantPaye / p.montantTotal) * 100)} %</span><Progress value={(p.montantPaye / p.montantTotal) * 100} /></div></td>
                    <td>{p.mode}</td>
                    <td><StatutBadge statut={p.statut} /></td>
                    <td>
                      <RowMenu actions={[
                        { label: "Enregistrer un paiement", onSelect: () => setCreation(true) },
                        { label: "Voir la facture", onSelect: () => navigate({ to: "/factures" }) },
                        { label: "Voir la réservation", onSelect: () => navigate({ to: "/reservations" }) },
                        { label: "Relancer le client", onSelect: () => notify("Relance envoyée au client.") },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <FormModal open={creation} onOpenChange={setCreation} title="Enregistrer un paiement" submitLabel="Enregistrer le paiement" wide
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const type = String(f.get("type"));
          addPaiement({
            id: newId("PA"), reference: `PAY-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
            client: String(f.get("client")), rattachement: String(f.get("rattachement")),
            montantTotal, montantPaye, type, mode: String(f.get("mode")),
            date: String(f.get("date")), note: String(f.get("note") ?? ""),
            statut: statutAuto(montantTotal, montantPaye, type),
          });
          setCreation(false);
          notify("Paiement enregistré.");
        }}>
        <Field label="Client"><SelectInput name="client" options={clients.map((c) => c.nom)} /></Field>
        <Field label="Réservation / devis"><SelectInput name="rattachement" options={reservations.map((r) => r.reference)} /></Field>
        <Field label="Montant total (€)"><TextInput type="number" min={0} name="montantTotal" value={montantTotal} onChange={(e) => setMontantTotal(Number(e.currentTarget.value))} /></Field>
        <Field label="Montant payé (€)"><TextInput type="number" min={0} name="montantPaye" value={montantPaye} onChange={(e) => setMontantPaye(Number(e.currentTarget.value))} /></Field>
        <Field label="Type"><SelectInput name="type" options={TYPES_PAIEMENT} /></Field>
        <Field label="Mode de paiement"><SelectInput name="mode" options={MODES_PAIEMENT} /></Field>
        <Field label="Date"><TextInput type="date" name="date" defaultValue="2026-09-16" /></Field>
        <Field label="Référence interne"><TextInput name="reference" placeholder="Virement, n° de chèque…" /></Field>
        <Field label="Note" full><TextArea name="note" placeholder="Précisions sur l'encaissement…" /></Field>
        <div className="calc-box field-full">
          <p><span>Montant total</span><b>{euro(montantTotal)}</b></p>
          <p><span>Déjà payé</span><b>{euro(montantPaye)}</b></p>
          <p className="grand"><span>Reste à payer</span><b>{euro(Math.max(0, montantTotal - montantPaye))}</b></p>
        </div>
      </FormModal>
    </div>
  );
}
