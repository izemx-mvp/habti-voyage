import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { EmptyState, FilterSelect, Panel, PanelTitle, StatutBadge } from "@/components/habti/ui-bits";
import { useHabti } from "@/lib/habti-store";
import { STATUTS_RESERVATION, VILLES, dateFr } from "@/lib/habti-data";

type Vue = "Jour" | "Semaine" | "Mois";
const JOURS = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."];
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const iso = (d: Date) => d.toISOString().slice(0, 10);

export function PlanningView() {
  const navigate = useNavigate();
  const { reservations, missions, employes } = useHabti();
  const [vue, setVue] = useState<Vue>("Semaine");
  const [ancre, setAncre] = useState(new Date("2026-09-16T12:00:00"));
  const [employe, setEmploye] = useState("Tous");
  const [ville, setVille] = useState("Tous");
  const [statut, setStatut] = useState("Tous");

  const pas = vue === "Jour" ? 1 : vue === "Semaine" ? 7 : 30;
  const decaler = (sens: number) => {
    const d = new Date(ancre);
    d.setDate(d.getDate() + sens * pas);
    setAncre(d);
  };

  const jours = useMemo(() => {
    if (vue === "Jour") return [new Date(ancre)];
    const debut = new Date(ancre);
    if (vue === "Semaine") {
      const decal = (debut.getDay() + 6) % 7;
      debut.setDate(debut.getDate() - decal);
      return Array.from({ length: 7 }, (_, i) => { const d = new Date(debut); d.setDate(debut.getDate() + i); return d; });
    }
    debut.setDate(1);
    const nb = new Date(debut.getFullYear(), debut.getMonth() + 1, 0).getDate();
    return Array.from({ length: nb }, (_, i) => { const d = new Date(debut); d.setDate(i + 1); return d; });
  }, [vue, ancre]);

  const evenements = useMemo(() => {
    const res = reservations.map((r) => ({ id: r.id, type: "reservation" as const, date: r.date, heure: r.heure, titre: r.prestation, meta: `${r.client} · ${r.participants} pers.`, employe: r.employe, ville: r.ville, statut: r.statut }));
    const mis = missions.map((m) => ({ id: m.id, type: "mission" as const, date: m.date, heure: m.heure, titre: m.titre, meta: `Mission · ${m.employes.join(", ") || "Non affectée"}`, employe: m.employes[0] ?? "", ville: m.lieu, statut: m.statut }));
    return [...res, ...mis].filter((e) => {
      if (employe !== "Tous" && e.employe !== employe) return false;
      if (ville !== "Tous" && !e.ville.includes(ville)) return false;
      if (statut !== "Tous" && e.statut !== statut) return false;
      return true;
    });
  }, [reservations, missions, employe, ville, statut]);

  const periode = vue === "Mois"
    ? `${MOIS[ancre.getMonth()]} ${ancre.getFullYear()}`
    : vue === "Jour"
      ? ancre.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      : `Semaine du ${jours[0]!.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`;

  const visibles = evenements.filter((e) => jours.some((j) => iso(j) === e.date));

  return (
    <div className="planning-grid">
      <Panel className="calendar-panel">
        <div className="calendar-toolbar">
          <div className="calendar-nav">
            <Button variant="outline" size="icon" aria-label="Période précédente" onClick={() => decaler(-1)}><ChevronLeft /></Button>
            <Button variant="outline" size="sm" onClick={() => setAncre(new Date("2026-09-16T12:00:00"))}>Aujourd'hui</Button>
            <Button variant="outline" size="icon" aria-label="Période suivante" onClick={() => decaler(1)}><ChevronRight /></Button>
            <strong>{periode}</strong>
          </div>
          <div className="view-switch">
            {(["Jour", "Semaine", "Mois"] as Vue[]).map((v) => (
              <button key={v} className={vue === v ? "active" : ""} onClick={() => setVue(v)}>{v}</button>
            ))}
          </div>
        </div>

        <div className="smart-filter">
          <FilterSelect label="Employé" value={employe} options={employes.map((e) => e.nom)} onChange={setEmploye} />
          <FilterSelect label="Ville" value={ville} options={VILLES} onChange={setVille} />
          <FilterSelect label="Statut" value={statut} options={STATUTS_RESERVATION} onChange={setStatut} />
          <Button variant="ghost" onClick={() => { setEmploye("Tous"); setVille("Tous"); setStatut("Tous"); }}>Réinitialiser</Button>
        </div>

        {visibles.length === 0 ? (
          <EmptyState titre="Aucun événement sur cette période." description="Changez de période ou créez une réservation."
            ctaLabel="Créer une réservation" onCta={() => navigate({ to: "/reservations", search: { nouveau: "1" } })} icon={CalendarDays} />
        ) : (
          <div className={`calendar-board vue-${vue.toLowerCase()}`}>
            {jours.map((j) => {
              const items = evenements.filter((e) => e.date === iso(j));
              return (
                <div className={`calendar-col ${iso(j) === "2026-09-16" ? "today" : ""}`} key={iso(j)}>
                  <header>
                    <span>{JOURS[(j.getDay() + 6) % 7]}</span>
                    <b>{j.getDate()}</b>
                  </header>
                  <div>
                    {items.map((e) => (
                      <button key={e.id} className={`booking-block ${e.type === "mission" ? "b3" : "b1"}`}
                        onClick={() => e.type === "mission"
                          ? navigate({ to: "/missions", search: { id: e.id } })
                          : navigate({ to: "/reservations", search: { id: e.id } })}>
                        <b>{e.heure} · {e.titre}</b>
                        <small>{e.meta}</small>
                      </button>
                    ))}
                    {items.length === 0 && <p className="calendar-empty">—</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      <Panel className="agenda">
        <PanelTitle title="Pouls opérationnel" subtitle="Charge d'équipe et prochaines échéances" />
        <div className="capacity">
          <div><span>Capacité du jour</span><b>82 %</b></div>
          <Progress value={82} />
        </div>
        {employes.slice(0, 4).map((e) => (
          <div className="agenda-row" key={e.id}>
            <div><b>{e.nom}</b><span>{e.role}</span></div>
            <StatutBadge statut={e.disponibilite} />
          </div>
        ))}
        <div className="agenda-next">
          <b>Prochaines échéances</b>
          {reservations.slice(0, 3).map((r) => (
            <button key={r.id} onClick={() => navigate({ to: "/reservations", search: { id: r.id } })}>
              {dateFr(r.date)} · {r.prestation}
            </button>
          ))}
        </div>
        <Button onClick={() => navigate({ to: "/missions", search: { nouveau: "1" } })}>Créer une mission</Button>
      </Panel>
    </div>
  );
}
