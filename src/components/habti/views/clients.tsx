import { useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Building2, Plus, Search, Users, Wallet } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ActiveChips, EmptyState, Field, FilterSelect, FormModal, Metric, Panel, RowMenu, SelectInput, TextInput,
} from "@/components/habti/ui-bits";
import { useHabti } from "@/lib/habti-store";
import { VILLES, euro, newId } from "@/lib/habti-data";

const SEGMENTS = ["Particulier", "Entreprise", "Agence partenaire"] as const;

export function ClientsView() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { nouveau?: string };
  const { clients, reservations, addClient, notify } = useHabti();
  const [q, setQ] = useState("");
  const [ville, setVille] = useState("Tous");
  const [segment, setSegment] = useState("Tous");
  const [creation, setCreation] = useState(search.nouveau === "1");
  const [selection, setSelection] = useState<string | null>(null);

  const liste = useMemo(() => clients.filter((c) => {
    if (q && !`${c.nom} ${c.email} ${c.ville}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (ville !== "Tous" && c.ville !== ville) return false;
    if (segment !== "Tous" && c.segment !== segment) return false;
    return true;
  }), [clients, q, ville, segment]);

  const chips = [
    ville !== "Tous" && { label: "Ville", value: ville },
    segment !== "Tous" && { label: "Segment", value: segment },
    q && { label: "Recherche", value: q },
  ].filter(Boolean) as { label: string; value: string }[];

  const reset = () => { setQ(""); setVille("Tous"); setSegment("Tous"); };

  return (
    <div className="module-stack">
      <div className="module-toolbar">
        <section className="metrics-grid metrics-3 grow">
          <Metric label="Clients actifs" value={String(clients.length)} icon={Users} />
          <Metric label="Chiffre d'affaires cumulé" value={euro(clients.reduce((s, c) => s + c.chiffreAffaires, 0))} icon={Wallet} tone="gold" />
          <Metric label="Réservations liées" value={String(reservations.length)} icon={Building2} />
        </section>
        <Button onClick={() => setCreation(true)}><Plus />Ajouter un client</Button>
      </div>

      <Panel className="crm-panel">
        <div className="smart-filter">
          <div><Search /><input placeholder="Rechercher un client…" value={q} onChange={(e) => setQ(e.currentTarget.value)} /></div>
          <FilterSelect label="Ville" value={ville} options={VILLES} onChange={setVille} />
          <FilterSelect label="Segment" value={segment} options={SEGMENTS} onChange={setSegment} />
        </div>
        <ActiveChips chips={chips} onClear={reset} onRemove={(l) => { if (l === "Ville") setVille("Tous"); if (l === "Segment") setSegment("Tous"); if (l === "Recherche") setQ(""); }} />

        {liste.length === 0 ? (
          <EmptyState titre="Aucun client ne correspond à vos filtres." ctaLabel="Réinitialiser les filtres" onCta={reset} icon={Users} />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Client</th><th>Segment</th><th>Réservations</th><th>Chiffre d'affaires</th><th>Client depuis</th><th /></tr>
              </thead>
              <tbody>
                {liste.map((c) => (
                  <tr key={c.id} className={selection === c.id ? "is-selected" : ""} onClick={() => setSelection(c.id)} onDoubleClick={() => navigate({ to: "/clients/$id", params: { id: c.id } })}>
                    <td>
                      <Avatar><AvatarFallback>{c.nom.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                      <div><b>{c.nom}</b><span>{c.ville} · {c.email}</span></div>
                    </td>
                    <td>{c.segment}</td>
                    <td>{c.reservations}</td>
                    <td><b>{euro(c.chiffreAffaires)}</b></td>
                    <td>{c.depuis}</td>
                    <td>
                      <RowMenu actions={[
                        { label: "Voir le détail", onSelect: () => navigate({ to: "/clients/$id", params: { id: c.id } }) },
                        { label: "Nouvelle réservation", onSelect: () => navigate({ to: "/reservations", search: { nouveau: "1" } }) },
                        { label: "Créer un devis", onSelect: () => navigate({ to: "/devis", search: { nouveau: "1" } }) },
                        { label: "Voir les factures", onSelect: () => navigate({ to: "/factures" }) },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <FormModal open={creation} onOpenChange={setCreation} title="Ajouter un client" submitLabel="Enregistrer le client"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          addClient({
            id: newId("C"), nom: String(f.get("nom")), ville: String(f.get("ville")), email: String(f.get("email")),
            telephone: String(f.get("telephone")), segment: String(f.get("segment")),
            reservations: 0, chiffreAffaires: 0, depuis: String(new Date().getFullYear()),
          });
          setCreation(false);
          notify("Client ajouté avec succès.");
        }}>
        <Field label="Nom / raison sociale" full><TextInput name="nom" required placeholder="Northstar & Co." /></Field>
        <Field label="Ville"><SelectInput name="ville" options={VILLES} /></Field>
        <Field label="Segment"><SelectInput name="segment" options={SEGMENTS} /></Field>
        <Field label="E-mail"><TextInput type="email" name="email" required placeholder="contact@societe.ma" /></Field>
        <Field label="Téléphone"><TextInput name="telephone" required placeholder="+212 5 22 00 00 00" /></Field>
      </FormModal>

    </div>
  );
}
