import { useMemo, useState } from "react";
import { useSearch } from "@tanstack/react-router";
import { Plus, ReceiptText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EmptyState, Field, FilterSelect, FormModal, Metric, Panel, RowMenu, SelectInput, StatutBadge, TextInput,
} from "@/components/habti/ui-bits";
import { HabtiLogo } from "@/components/habti/logo";
import { useHabti } from "@/lib/habti-store";
import { dateFr, euro, newId, totalDevis, type Facture } from "@/lib/habti-data";

const STATUTS_FACTURE = ["Non payé", "Partiellement payé", "Payé", "En retard"];

export function FacturesView() {
  const search = useSearch({ strict: false }) as { statut?: string; nouveau?: string };
  const { factures, clients, devis, reservations, addFacture, updateFacture, notify } = useHabti();
  const [q, setQ] = useState("");
  const [statut, setStatut] = useState(search.statut ?? "Tous");
  const [creation, setCreation] = useState(search.nouveau === "1");
  const [apercu, setApercu] = useState<Facture | null>(null);

  const liste = useMemo(() => factures.filter((f) => {
    if (q && !`${f.reference} ${f.client}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (statut !== "Tous" && f.statut !== statut) return false;
    return true;
  }), [factures, q, statut]);

  const origines = [
    ...devis.filter((d) => d.statut === "Accepté").map((d) => `${d.reference} — ${d.client} — ${euro(totalDevis(d).ttc)}`),
    ...reservations.filter((r) => r.statut === "Confirmée").map((r) => `${r.reference} — ${r.client} — ${euro(r.tarif * r.participants)}`),
  ];

  return (
    <div className="module-stack">
      <div className="module-toolbar">
        <section className="metrics-grid metrics-3 grow">
          <Metric label="Factures émises" value={String(factures.length)} icon={ReceiptText} />
          <Metric label="Montant facturé" value={euro(factures.reduce((s, f) => s + f.montant, 0))} icon={ReceiptText} tone="gold" />
          <Metric label="Factures impayées" value={String(factures.filter((f) => f.statut !== "Payé").length)} icon={ReceiptText} />
        </section>
        <Button onClick={() => setCreation(true)}><Plus />Créer une facture</Button>
      </div>

      <Panel className="crm-panel">
        <div className="smart-filter">
          <div><Search /><input placeholder="Rechercher une facture…" value={q} onChange={(e) => setQ(e.currentTarget.value)} /></div>
          <FilterSelect label="Statut" value={statut} options={STATUTS_FACTURE} onChange={setStatut} />
          <Button variant="ghost" onClick={() => { setQ(""); setStatut("Tous"); }}>Réinitialiser</Button>
        </div>
        {liste.length === 0 ? (
          <EmptyState titre="Aucune facture ne correspond à vos filtres." ctaLabel="Créer une facture" onCta={() => setCreation(true)} icon={ReceiptText} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Référence</th><th>Client</th><th>Origine</th><th>Montant</th><th>Échéance</th><th>Statut</th><th /></tr></thead>
              <tbody>
                {liste.map((f) => (
                  <tr key={f.id} onClick={() => setApercu(f)}>
                    <td><b>{f.reference}</b><span>{dateFr(f.date)}</span></td>
                    <td>{f.client}</td>
                    <td>{f.origine}</td>
                    <td><b>{euro(f.montant)}</b></td>
                    <td>{dateFr(f.echeance)}</td>
                    <td><StatutBadge statut={f.statut} /></td>
                    <td>
                      <RowMenu actions={[
                        { label: "Prévisualiser", onSelect: () => setApercu(f) },
                        { label: "Télécharger", onSelect: () => { setApercu(f); notify("Aperçu PDF prêt à imprimer."); } },
                        { label: "Envoyer au client", onSelect: () => notify("Facture envoyée au client.") },
                        { label: "Marquer comme payée", onSelect: () => { updateFacture(f.id, { statut: "Payé" }); notify("Facture marquée comme payée."); } },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <FormModal open={creation} onOpenChange={setCreation} title="Créer une facture" submitLabel="Créer la facture"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          addFacture({
            id: newId("F"), reference: `FA-2026-${Math.floor(Math.random() * 900 + 100)}`,
            client: String(f.get("client")), origine: String(f.get("origine")).split(" — ")[0] ?? "Saisie manuelle",
            montant: Number(f.get("montant")), date: String(f.get("date")), echeance: String(f.get("echeance")),
            statut: "Non payé",
          });
          setCreation(false);
          notify("Facture créée avec succès.");
        }}>
        <Field label="Client"><SelectInput name="client" options={clients.map((c) => c.nom)} /></Field>
        <Field label="Origine (devis accepté / réservation confirmée)"><SelectInput name="origine" options={origines.length ? origines : ["Saisie manuelle"]} /></Field>
        <Field label="Montant TTC (€)"><TextInput type="number" name="montant" min={0} defaultValue={1800} /></Field>
        <Field label="Date d'émission"><TextInput type="date" name="date" defaultValue="2026-09-16" /></Field>
        <Field label="Échéance"><TextInput type="date" name="echeance" defaultValue="2026-10-16" /></Field>
      </FormModal>

      {apercu && (
        <FormModal open onOpenChange={() => setApercu(null)} title={`Aperçu ${apercu.reference}`} submitLabel="Envoyer au client" wide
          onSubmit={(e) => { e.preventDefault(); setApercu(null); notify("Facture envoyée au client."); }}>
          <div className="document-preview">
            <header>
              <HabtiLogo />
              <div><b>{apercu.reference}</b><span>Émise le {dateFr(apercu.date)} · Échéance {dateFr(apercu.echeance)}</span></div>
            </header>
            <p className="doc-client">Client : <b>{apercu.client}</b></p>
            <table className="doc-table">
              <thead><tr><th>Désignation</th><th>Total</th></tr></thead>
              <tbody><tr><td>Prestations Habti Voyage — {apercu.origine}</td><td>{euro(apercu.montant)}</td></tr></tbody>
            </table>
            <div className="doc-totals"><p className="grand"><span>Total à régler</span><b>{euro(apercu.montant)}</b></p></div>
            <footer>Habti Voyage — Agence de voyages et d'événements au Maroc — Depuis 1978</footer>
          </div>
          <div className="doc-actions">
            <Button type="button" variant="outline" onClick={() => window.print()}>Télécharger</Button>
            <Button type="button" variant="outline" onClick={() => { updateFacture(apercu.id, { statut: "Payé" }); setApercu(null); notify("Facture marquée comme payée."); }}>Marquer comme payée</Button>
          </div>
        </FormModal>
      )}
    </div>
  );
}
