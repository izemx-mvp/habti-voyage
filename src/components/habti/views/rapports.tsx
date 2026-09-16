import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Download, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSelect, Metric, Panel, PanelTitle } from "@/components/habti/ui-bits";
import { useHabti } from "@/lib/habti-store";
import { VILLES, euro, perfChart, totalDevis } from "@/lib/habti-data";

const PERIODES = ["30 derniers jours", "Trimestre en cours", "Année en cours"];
const COULEURS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export function RapportsView() {
  const navigate = useNavigate();
  const { reservations, devis, paiements, prospects, prestations, notify } = useHabti();
  const [periode, setPeriode] = useState(PERIODES[0]!);
  const [ville, setVille] = useState("Tous");

  const resFiltrees = ville === "Tous" ? reservations : reservations.filter((r) => r.ville === ville);
  const ca = resFiltrees.reduce((s, r) => s + r.tarif * r.participants, 0);
  const encaisse = paiements.reduce((s, p) => s + p.montantPaye, 0);
  const tauxConversion = Math.round((prospects.filter((p) => ["Client", "Réservation confirmée"].includes(p.statut)).length / Math.max(1, prospects.length)) * 100);
  const panier = Math.round(ca / Math.max(1, resFiltrees.length));

  const parVille = VILLES.map((v) => ({
    ville: v,
    reservations: reservations.filter((r) => r.ville === v).length,
  })).filter((d) => d.reservations > 0);

  const parCategorie = ["Activité", "Voyage", "Événement", "Package"].map((c) => ({
    name: c,
    value: prestations.filter((p) => p.categorie === c).length,
  })).filter((d) => d.value > 0);

  const exporter = () => {
    const lignes = [["Référence", "Client", "Ville", "Date", "Montant"], ...resFiltrees.map((r) => [r.reference, r.client, r.ville, r.date, String(r.tarif * r.participants)])];
    const csv = lignes.map((l) => l.join(";")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url; a.download = "habti-rapport-reservations.csv"; a.click();
    URL.revokeObjectURL(url);
    notify("Rapport exporté au format CSV.");
  };

  return (
    <div className="module-stack">
      <div className="module-toolbar">
        <div className="smart-filter grow">
          <FilterSelect label="Période" value={periode} options={PERIODES} onChange={setPeriode} />
          <FilterSelect label="Ville" value={ville} options={VILLES} onChange={setVille} />
          <Button variant="ghost" onClick={() => { setPeriode(PERIODES[0]!); setVille("Tous"); }}>Réinitialiser les filtres</Button>
        </div>
        <Button onClick={exporter}><Download />Exporter le rapport</Button>
      </div>

      <section className="metrics-grid metrics-4">
        <Metric label="Chiffre d'affaires" value={euro(ca)} delta="+12,4 %" icon={TrendingUp} onClick={() => navigate({ to: "/paiements" })} />
        <Metric label="Encaissements" value={euro(encaisse)} delta="+8,1 %" icon={TrendingUp} tone="gold" onClick={() => navigate({ to: "/paiements" })} />
        <Metric label="Taux de conversion" value={`${tauxConversion} %`} delta="+3,6 pts" icon={TrendingUp} onClick={() => navigate({ to: "/prospects" })} />
        <Metric label="Panier moyen" value={euro(panier)} delta="+5,2 %" icon={TrendingUp} onClick={() => navigate({ to: "/reservations" })} />
      </section>

      <div className="charts-row">
        <Panel>
          <PanelTitle title="Évolution commerciale" subtitle={`Réservations et chiffre d'affaires — ${periode.toLowerCase()}`} />
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={perfChart}>
              <defs>
                <linearGradient id="gCa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 6" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="mois" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Legend />
              <Area type="monotone" dataKey="ca" name="Chiffre d'affaires (€)" stroke="var(--chart-1)" fill="url(#gCa)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel>
          <PanelTitle title="Répartition du catalogue" subtitle="Prestations par catégorie" />
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={parCategorie} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
                {parCategorie.map((_, i) => <Cell key={i} fill={COULEURS[i % COULEURS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Panel>
        <PanelTitle title="Réservations par ville" subtitle="Volume par destination" />
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={parVille}>
            <CartesianGrid strokeDasharray="4 6" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="ville" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} stroke="var(--muted-foreground)" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
            <Bar dataKey="reservations" name="Réservations" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Panel>

      <Panel>
        <PanelTitle title="Performance commerciale détaillée" subtitle="Devis et conversions" />
        <div className="table-wrap">
          <table>
            <thead><tr><th>Référence</th><th>Client</th><th>Montant TTC</th><th>Statut</th></tr></thead>
            <tbody>
              {devis.map((d) => (
                <tr key={d.id} onClick={() => navigate({ to: "/devis" })}>
                  <td><b>{d.reference}</b></td><td>{d.client}</td><td>{euro(totalDevis(d).ttc)}</td><td>{d.statut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
