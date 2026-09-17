import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight, BadgeCheck, Bot, CalendarDays, Clock3, FileText, MapPin, Plus, Sparkle, Target, TrendingUp, WalletCards, BookOpen, Megaphone,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Metric, Panel, PanelTitle } from "@/components/habti/ui-bits";
import { useHabti } from "@/lib/habti-store";
import { euro, perfChart } from "@/lib/habti-data";

const TONES = ["green", "gold", "blue", "pink"];

export function DashboardView() {
  const navigate = useNavigate();
  const { prospects, reservations, devis, paiements, missions, prestations, tickets, socialPosts, campagnes } = useHabti();

  const nouveaux = prospects.filter((p) => p.statut === "Nouveau").length;
  const qualifies = prospects.filter((p) => p.statut === "Qualifié").length;
  const actives = reservations.filter((r) => ["Réservée", "Confirmée", "En cours"].includes(r.statut)).length;
  const enAttentePaiement = paiements.filter((p) => p.statut !== "Payé" && p.statut !== "Remboursé")
    .reduce((s, p) => s + (p.montantTotal - p.montantPaye), 0);
  const devisEnAttente = devis.filter((d) => ["À valider", "Envoyé", "En attente"].includes(d.statut)).length;
  const jour = reservations.filter((r) => r.date === "2026-09-16");
  const missionsJour = missions.filter((m) => m.date === "2026-09-16");

  return (
    <>
      <section className="metrics-grid">
        <Metric label="Nouveaux prospects" value={String(nouveaux || prospects.length)} delta="12,5 %" icon={Target}
          onClick={() => navigate({ to: "/prospects", search: { statut: "Nouveau" } })} />
        <Metric label="Prospects qualifiés" value={String(qualifies)} delta="8,2 %" icon={BadgeCheck}
          onClick={() => navigate({ to: "/prospects", search: { statut: "Qualifié" } })} />
        <Metric label="Réservations actives" value={String(actives)} delta="16,4 %" icon={BookOpen}
          onClick={() => navigate({ to: "/reservations", search: { statut: "Confirmée" } })} />
        <Metric label="Paiements en attente" value={euro(enAttentePaiement)} delta="4,1 %" icon={WalletCards} tone="gold"
          onClick={() => navigate({ to: "/paiements", search: { statut: "En retard" } })} />
      </section>

      <section className="dashboard-grid">
        <Panel className="performance-panel">
          <PanelTitle title="Performance commerciale" subtitle="Chiffre d'affaires et trajectoire de conversion"
            action="9 derniers mois" onAction={() => navigate({ to: "/rapports" })} />
          <div className="chart-summary">
            <div>
              <b>{euro(482940)}</b>
              <span><TrendingUp />+18,2 % de chiffre d'affaires</span>
            </div>
            <div className="mini-kpis">
              <p><i />Conversion <b>24,8 %</b></p>
              <p><i />Panier moyen <b>{euro(2460)}</b></p>
            </div>
          </div>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={perfChart}>
                <defs>
                  <linearGradient id="emeraldChart" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.38} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="m" axisLine={false} tickLine={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v} k€`, "Chiffre d'affaires"]} labelFormatter={(l) => `Mois : ${l}`}
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 11 }} />
                <Area type="monotone" dataKey="v" name="Chiffre d'affaires" stroke="var(--primary)" strokeWidth={3} fill="url(#emeraldChart)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="ai-insight">
          <div className="insight-head">
            <div className="ai-orbit"><Bot /></div>
            <Badge>Analyse IA</Badge>
          </div>
          <h3>La demande entreprise s'accélère à Marrakech</h3>
          <p>Six demandes à forte valeur mentionnent un séminaire en octobre. Les disponibilités Agafay et Atlas se réduisent.</p>
          <div className="insight-stat"><span>Revenu potentiel</span><b>{euro(38600)}</b></div>
          <Button onClick={() => navigate({ to: "/prospects", search: { statut: "Proposition à préparer" } })}>
            Voir les opportunités<ArrowRight />
          </Button>
        </Panel>
      </section>

      <section className="metrics-grid metrics-4">
        <Metric label="Opérations du jour" value={String(missionsJour.length)} icon={Clock3} onClick={() => navigate({ to: "/operations" })} />
        <Metric label="Devis à traiter" value={String(devisEnAttente)} icon={FileText} onClick={() => navigate({ to: "/devis", search: { statut: "À valider" } })} />
        <Metric label="Conversations support" value={String(tickets.filter((t) => t.statut !== "Résolu" && t.statut !== "Fermé").length)} icon={Bot} onClick={() => navigate({ to: "/agent-service-client" })} />
        <Metric label="Publications planifiées" value={String(socialPosts.filter((p) => p.statut === "Planifié").length)} icon={Sparkle} tone="gold" onClick={() => navigate({ to: "/community-manager/idees" })} />
      </section>

      <section className="lower-grid">
        <Panel>
          <PanelTitle title="Le rythme du jour" subtitle="Activités, arrivées et relais d'équipe"
            action="Voir le planning" onAction={() => navigate({ to: "/planning" })} />
          <div className="timeline">
            {jour.length === 0 && missionsJour.length === 0 ? (
              <div className="mini-empty">
                <p>Aucune réservation aujourd'hui.</p>
                <Button size="sm" onClick={() => navigate({ to: "/reservations", search: { nouveau: "1" } })}>Créer une réservation</Button>
              </div>
            ) : jour.map((r, i) => (
              <div className="timeline-row" key={r.id}>
                <time>{r.heure}</time>
                <i className={TONES[i % TONES.length]} />
                <div><b>{r.prestation}</b><span>{r.participants} participants · {r.employe}</span></div>
                <Button variant="ghost" size="icon" aria-label="Voir la réservation"
                  onClick={() => navigate({ to: "/reservations/$id", params: { id: r.id } })}><ArrowRight /></Button>
              </div>
            ))}
            {missionsJour.map((m) => (
              <div className="timeline-row" key={m.id}>
                <time>{m.heure}</time>
                <i className="blue" />
                <div><b>{m.titre}</b><span>Mission · {m.employes.join(", ") || "Non affectée"}</span></div>
                <Button variant="ghost" size="icon" aria-label="Voir la mission"
                  onClick={() => navigate({ to: "/operations/$id", params: { id: m.id } })}><ArrowRight /></Button>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <PanelTitle title="Expériences les plus demandées" subtitle="Sur la base de 284 demandes récentes"
            action="Ouvrir le catalogue" onAction={() => navigate({ to: "/catalogue" })} />
          <div className="destination-list">
            {prestations.slice(0, 4).map((e) => (
              <button className="destination-row" key={e.id} onClick={() => navigate({ to: "/catalogue", search: { id: e.id } })}>
                <img src={e.image} alt={e.nom} loading="lazy" width="120" height="80" />
                <div><b>{e.nom}</b><span><MapPin />{e.ville} · {e.duree}</span></div>
                <strong>{e.score} %</strong>
                <Progress value={e.score} />
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="quick-actions">
          <PanelTitle title="Actions rapides" subtitle="Faites avancer votre journée" />
          <div>
            {[
              { icon: Plus, t: "Nouveau prospect", s: "Capter une opportunité", to: "/prospects" as const },
              { icon: CalendarDays, t: "Nouvelle réservation", s: "Réserver une expérience", to: "/reservations" as const },
              { icon: FileText, t: "Nouveau devis", s: "Construire une offre", to: "/devis" as const },
              { icon: Sparkle, t: "Nouvelle publication", s: "Préparer les réseaux", to: "/community-manager/idees" as const },
              { icon: Megaphone, t: "Nouvelle campagne", s: "Activer une audience", to: "/campagnes" as const },
            ].map(({ icon: Icon, t, s, to }) => (
              <button key={t} onClick={() => navigate({ to, search: { nouveau: "1" } })}>
                <span><Icon /></span>
                <div><b>{t}</b><small>{s}</small></div>
                <ArrowRight />
              </button>
            ))}
          </div>
          <div className="quick-note">
            <Clock3 /><span>{devisEnAttente} devis en attente de validation</span>
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/devis", search: { statut: "À valider" } })}>Voir</Button>
          </div>
        </Panel>
      </section>
    </>
  );
}
