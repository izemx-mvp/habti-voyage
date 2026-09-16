import { useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { FileText, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ConfirmDialog, EmptyState, Field, FilterSelect, FormModal, Metric, Panel, RowMenu, SelectInput, StatutBadge, TextInput,
} from "@/components/habti/ui-bits";
import { HabtiLogo } from "@/components/habti/logo";
import { useHabti } from "@/lib/habti-store";
import { STATUTS_DEVIS, dateFr, euro, newId, totalDevis, type Devis, type LigneDevis } from "@/lib/habti-data";

export function DevisView() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { statut?: string; nouveau?: string };
  const { devis, clients, prestations, addDevis, updateDevis, addFacture, notify } = useHabti();

  const [q, setQ] = useState("");
  const [statut, setStatut] = useState(search.statut ?? "Tous");
  const [builder, setBuilder] = useState(search.nouveau === "1");
  const [apercu, setApercu] = useState<Devis | null>(null);
  const [suppression, setSuppression] = useState<Devis | null>(null);

  const liste = useMemo(() => devis.filter((d) => {
    if (q && !`${d.reference} ${d.client}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (statut !== "Tous" && d.statut !== statut) return false;
    return true;
  }), [devis, q, statut]);

  const enAttente = devis.filter((d) => ["À valider", "Envoyé", "En attente"].includes(d.statut));
  const acceptes = devis.filter((d) => d.statut === "Accepté");

  return (
    <div className="module-stack">
      <div className="module-toolbar">
        <section className="metrics-grid metrics-3 grow">
          <Metric label="Devis en cours" value={String(enAttente.length)} icon={FileText} />
          <Metric label="Montant proposé" value={euro(devis.reduce((s, d) => s + totalDevis(d).ttc, 0))} icon={FileText} tone="gold" />
          <Metric label="Devis acceptés" value={String(acceptes.length)} icon={FileText} />
        </section>
        <Button onClick={() => setBuilder(true)}><Plus />Nouveau devis</Button>
      </div>

      <Panel className="crm-panel">
        <div className="smart-filter">
          <div><Search /><input placeholder="Rechercher un devis…" value={q} onChange={(e) => setQ(e.currentTarget.value)} /></div>
          <FilterSelect label="Statut" value={statut} options={STATUTS_DEVIS} onChange={setStatut} />
          <Button variant="ghost" onClick={() => { setQ(""); setStatut("Tous"); }}>Réinitialiser</Button>
        </div>
        {liste.length === 0 ? (
          <EmptyState titre="Aucun devis ne correspond à vos filtres." ctaLabel="Créer un devis" onCta={() => setBuilder(true)} icon={FileText} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Référence</th><th>Client</th><th>Montant TTC</th><th>Statut</th><th>Validité</th><th /></tr></thead>
              <tbody>
                {liste.map((d) => (
                  <tr key={d.id} onClick={() => setApercu(d)}>
                    <td><b>{d.reference}</b></td>
                    <td>{d.client}</td>
                    <td><b>{euro(totalDevis(d).ttc)}</b></td>
                    <td><StatutBadge statut={d.statut} /></td>
                    <td>{dateFr(d.validite)}</td>
                    <td>
                      <RowMenu actions={[
                        { label: "Prévisualiser", onSelect: () => setApercu(d) },
                        { label: "Envoyer", onSelect: () => { updateDevis(d.id, { statut: "Envoyé" }); notify("Devis envoyé au client."); } },
                        { label: "Télécharger le PDF", onSelect: () => { setApercu(d); notify("Aperçu PDF prêt à imprimer."); } },
                        { label: "Dupliquer", onSelect: () => { addDevis({ ...d, id: newId("D"), reference: `DV-2026-${Math.floor(Math.random() * 900 + 100)}`, statut: "Brouillon" }); notify("Devis dupliqué."); } },
                        { label: "Accepter", onSelect: () => {
                          updateDevis(d.id, { statut: "Accepté" });
                          addFacture({ id: newId("F"), reference: `FA-2026-${Math.floor(Math.random() * 900 + 100)}`, client: d.client, montant: totalDevis(d).ttc, date: new Date().toISOString().slice(0, 10), echeance: d.validite, statut: "Non payé", origine: d.reference });
                          notify("Devis accepté. Facture générée.");
                        } },
                        { label: "Refuser", onSelect: () => { updateDevis(d.id, { statut: "Refusé" }); notify("Devis marqué comme refusé."); } },
                        { label: "Supprimer", danger: true, onSelect: () => setSuppression(d) },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      {builder && (
        <DevisBuilder
          clients={clients.map((c) => c.nom)}
          prestations={prestations}
          onClose={() => setBuilder(false)}
          onSave={(d, envoyer) => {
            addDevis(d);
            setBuilder(false);
            notify(envoyer ? "Devis envoyé au client." : "Brouillon enregistré.");
          }}
        />
      )}

      <ConfirmDialog open={!!suppression} onOpenChange={(o) => !o && setSuppression(null)}
        onConfirm={() => { if (suppression) { updateDevis(suppression.id, { statut: "Expiré" }); notify("Devis archivé."); } setSuppression(null); }} />

      {apercu && (
        <FormModal open onOpenChange={() => setApercu(null)} title={`Aperçu ${apercu.reference}`} submitLabel="Envoyer au client" wide
          onSubmit={(e) => { e.preventDefault(); updateDevis(apercu.id, { statut: "Envoyé" }); setApercu(null); notify("Devis envoyé au client."); }}>
          <div className="document-preview">
            <header>
              <HabtiLogo />
              <div>
                <b>{apercu.reference}</b>
                <span>Émis le {dateFr(apercu.date)} · Valable jusqu'au {dateFr(apercu.validite)}</span>
              </div>
            </header>
            <p className="doc-client">Client : <b>{apercu.client}</b></p>
            <table className="doc-table">
              <thead><tr><th>Désignation</th><th>Qté</th><th>P.U.</th><th>Total</th></tr></thead>
              <tbody>
                {apercu.lignes.map((l) => (
                  <tr key={l.id}><td>{l.designation}</td><td>{l.quantite}</td><td>{euro(l.prixUnitaire)}</td><td>{euro(l.quantite * l.prixUnitaire)}</td></tr>
                ))}
              </tbody>
            </table>
            <div className="doc-totals">
              <p><span>Total HT</span><b>{euro(totalDevis(apercu).ht)}</b></p>
              <p><span>Remise ({apercu.remise} %)</span><b>-{euro(totalDevis(apercu).remise)}</b></p>
              <p><span>TVA ({apercu.tva} %)</span><b>{euro(totalDevis(apercu).tva)}</b></p>
              <p className="grand"><span>Total TTC</span><b>{euro(totalDevis(apercu).ttc)}</b></p>
            </div>
            <footer>Habti Voyage — Agence de voyages et d'événements au Maroc — Depuis 1978</footer>
          </div>
          <div className="doc-actions">
            <Button type="button" variant="outline" onClick={() => window.print()}>Télécharger le PDF</Button>
            <Button type="button" variant="outline" onClick={() => { updateDevis(apercu.id, { statut: "Accepté" }); setApercu(null); notify("Devis accepté."); }}>Accepter</Button>
            <Button type="button" variant="outline" onClick={() => { updateDevis(apercu.id, { statut: "Refusé" }); setApercu(null); notify("Devis refusé."); }}>Refuser</Button>
            <Button type="button" variant="outline" onClick={() => navigate({ to: "/factures" })}>Voir les factures</Button>
          </div>
        </FormModal>
      )}
    </div>
  );
}

function DevisBuilder({ clients, prestations, onClose, onSave }: {
  clients: string[]; prestations: { nom: string; prix: number }[];
  onClose: () => void; onSave: (d: Devis, envoyer: boolean) => void;
}) {
  const [client, setClient] = useState(clients[0] ?? "Nouveau client");
  const [lignes, setLignes] = useState<LigneDevis[]>([{ id: newId("l"), designation: prestations[0]?.nom ?? "Prestation", quantite: 2, prixUnitaire: prestations[0]?.prix ?? 250 }]);
  const [remise, setRemise] = useState(0);
  const [tva, setTva] = useState(20);
  const [validite, setValidite] = useState("2026-10-15");

  const brouillon: Devis = {
    id: newId("D"), reference: `DV-2026-${Math.floor(Math.random() * 900 + 100)}`, client, lignes, remise, tva,
    statut: "Brouillon", date: new Date().toISOString().slice(0, 10), validite,
  };
  const t = totalDevis(brouillon);

  const maj = (id: string, patch: Partial<LigneDevis>) => setLignes((l) => l.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <section className="builder-panel" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-label="Constructeur de devis">
        <div className="drawer-head">
          <div><div><h2>Nouveau devis</h2><p>Composez l'offre, les totaux se calculent automatiquement.</p></div></div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fermer">×</Button>
        </div>

        <div className="form-grid">
          <Field label="Client"><SelectInput value={client} onChange={(e) => setClient(e.currentTarget.value)} options={clients.length ? clients : ["Nouveau client"]} /></Field>
          <Field label="Valable jusqu'au"><TextInput type="date" value={validite} onChange={(e) => setValidite(e.currentTarget.value)} /></Field>
          <Field label="Remise (%)"><TextInput type="number" min={0} max={50} value={remise} onChange={(e) => setRemise(Number(e.currentTarget.value))} /></Field>
          <Field label="TVA (%)"><TextInput type="number" min={0} max={30} value={tva} onChange={(e) => setTva(Number(e.currentTarget.value))} /></Field>
        </div>

        <h4 className="block-title">Prestations</h4>
        <div className="lines">
          {lignes.map((l) => (
            <div className="line-row" key={l.id}>
              <select className="habti-input" value={l.designation} onChange={(e) => {
                const p = prestations.find((x) => x.nom === e.currentTarget.value);
                maj(l.id, { designation: e.currentTarget.value, prixUnitaire: p?.prix ?? l.prixUnitaire });
              }}>
                {prestations.map((p) => <option key={p.nom} value={p.nom}>{p.nom}</option>)}
                {!prestations.some((p) => p.nom === l.designation) && <option value={l.designation}>{l.designation}</option>}
              </select>
              <input className="habti-input" type="number" min={1} value={l.quantite} onChange={(e) => maj(l.id, { quantite: Number(e.currentTarget.value) })} aria-label="Quantité" />
              <input className="habti-input" type="number" min={0} step={10} value={l.prixUnitaire} onChange={(e) => maj(l.id, { prixUnitaire: Number(e.currentTarget.value) })} aria-label="Prix unitaire" />
              <b>{euro(l.quantite * l.prixUnitaire)}</b>
              <Button variant="ghost" size="icon" aria-label="Supprimer la ligne" onClick={() => setLignes((x) => x.filter((y) => y.id !== l.id))}><Trash2 /></Button>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={() => setLignes((l) => [...l, { id: newId("l"), designation: prestations[0]?.nom ?? "Prestation", quantite: 1, prixUnitaire: prestations[0]?.prix ?? 200 }])}>
          <Plus />Ajouter une ligne
        </Button>

        <div className="doc-totals">
          <p><span>Total HT</span><b>{euro(t.ht)}</b></p>
          <p><span>Remise</span><b>-{euro(t.remise)}</b></p>
          <p><span>TVA</span><b>{euro(t.tva)}</b></p>
          <p className="grand"><span>Total TTC</span><b>{euro(t.ttc)}</b></p>
        </div>

        <div className="drawer-actions">
          <Button variant="outline" onClick={() => onSave(brouillon, false)}>Enregistrer le brouillon</Button>
          <Button onClick={() => onSave({ ...brouillon, statut: "Envoyé" }, true)}>Envoyer le devis</Button>
        </div>
      </section>
    </div>
  );
}
