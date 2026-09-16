import { useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Send, Sparkles, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Panel, PanelTitle, StatutBadge, TextArea } from "@/components/habti/ui-bits";
import { useHabti } from "@/lib/habti-store";
import { MOODS, VILLES, euro, newId } from "@/lib/habti-data";

type Msg = { id: string; role: "ia" | "prospect"; texte: string };

type Fiche = {
  ville: string; dates: string; personnes: string; budget: string;
  typeVoyage: string; activite: string; mood: string; preferences: string; interet: number;
};

const ficheVide: Fiche = {
  ville: "—", dates: "—", personnes: "—", budget: "—",
  typeVoyage: "—", activite: "—", mood: "—", preferences: "—", interet: 20,
};

const questions = [
  "Bonjour et bienvenue chez Habti Voyage. Je suis votre assistant commercial. Quelle ville du Maroc souhaitez-vous découvrir ?",
  "Parfait. À quelles dates envisagez-vous ce séjour, et pour combien de personnes ?",
  "Très bien. Quel budget global avez-vous en tête pour cette expérience ?",
  "Merci. Quelle ambiance recherchez-vous : aventure, détente, culture, luxe, team building ?",
  "Excellent. Avez-vous des préférences particulières (hébergement, restauration, rythme, accessibilité) ?",
  "Merci beaucoup, votre demande est qualifiée. Un conseiller Habti Voyage vous proposera une sélection d'expériences adaptées sous 2 heures.",
];

const extraire = (texte: string, fiche: Fiche, etape: number): Fiche => {
  const t = texte.toLowerCase();
  const next = { ...fiche };
  const ville = VILLES.find((v) => t.includes(v.toLowerCase()));
  if (ville) next.ville = ville;
  const mood = MOODS.find((m) => t.includes(m.toLowerCase()));
  if (mood) next.mood = mood;
  const personnes = t.match(/(\d+)\s*(personnes|pers|adultes|participants|invités)/);
  if (personnes) next.personnes = `${personnes[1]} personnes`;
  const budget = t.match(/(\d[\d\s.]{2,})\s*(€|eur|euros|dh|dirhams)?/);
  if (budget && etape >= 2) next.budget = String(budget[1]).replace(/\s/g, "") + " €";
  const dates = t.match(/(\d{1,2}\s*(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)[^,.]*)/);
  if (dates?.[1]) next.dates = dates[1];
  if (/(mariage|noces|romantique)/.test(t)) next.typeVoyage = "Voyage de noces";
  else if (/(entreprise|séminaire|team|collaborateurs)/.test(t)) next.typeVoyage = "Séminaire d'entreprise";
  else if (/(famille|enfants)/.test(t)) next.typeVoyage = "Voyage famille";
  else if (etape >= 1 && next.typeVoyage === "—") next.typeVoyage = "Voyage sur mesure";
  if (/(désert|quad|montgolfière|surf|spa|hammam|circuit|dîner|excursion)/.test(t)) {
    next.activite = (texte.split(/[,.]/)[0] ?? texte).slice(0, 60);
  }
  if (etape >= 4) next.preferences = texte.slice(0, 90);
  next.interet = Math.min(96, fiche.interet + 15);
  return next;
};

export function AgentProspectionView() {
  const navigate = useNavigate();
  const { addProspect, notify } = useHabti();
  const [messages, setMessages] = useState<Msg[]>([{ id: newId("m"), role: "ia", texte: questions[0]! }]);
  const [etape, setEtape] = useState(0);
  const [fiche, setFiche] = useState<Fiche>(ficheVide);
  const [saisie, setSaisie] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const zone = useRef<HTMLDivElement>(null);

  const envoyer = () => {
    const texte = saisie.trim();
    if (!texte) return;
    const nouvelleFiche = extraire(texte, fiche, etape);
    const suivant = Math.min(etape + 1, questions.length - 1);
    setMessages((m) => [
      ...m,
      { id: newId("m"), role: "prospect", texte },
      { id: newId("m"), role: "ia", texte: questions[suivant] ?? "" },
    ]);
    setFiche(nouvelleFiche);
    setEtape(suivant);
    setSaisie("");
    requestAnimationFrame(() => zone.current?.scrollTo({ top: zone.current.scrollHeight, behavior: "smooth" }));
  };

  const niveau = useMemo(() => (fiche.interet >= 80 ? "Très chaud" : fiche.interet >= 55 ? "Chaud" : "À qualifier"), [fiche.interet]);

  const enregistrer = () => {
    addProspect({
      id: newId("P"), prenom: "Nouveau", nom: "Contact IA", telephone: "—", email: "—",
      ville: fiche.ville === "—" ? "Marrakech" : fiche.ville, source: "Site web",
      typeDemande: fiche.typeVoyage === "—" ? "Voyage" : fiche.typeVoyage,
      dateSouhaitee: "2026-10-20", personnes: Number(fiche.personnes.replace(/\D/g, "")) || 2,
      budget: Number(fiche.budget.replace(/\D/g, "")) || 3000,
      mood: fiche.mood === "—" ? "Découverte" : fiche.mood,
      activites: fiche.activite === "—" ? "À définir" : fiche.activite,
      notes: [{ id: newId("n"), texte: `Qualification IA : ${fiche.preferences}`, date: new Date().toLocaleDateString("fr-FR"), auteur: "Agent IA" }],
      statut: "Qualifié", score: fiche.interet, conseiller: "Salma Bennani",
      createdAt: new Date().toISOString().slice(0, 10),
      historique: [{ texte: "Prospect créé par l'agent de prospection IA", date: new Date().toLocaleString("fr-FR") }],
    });
    notify("Prospect enregistré depuis la conversation IA.");
  };

  return (
    <div className="ai-layout">
      <Panel className="ai-chat">
        <PanelTitle title="Agent IA de prospection" subtitle="Simulation de qualification d'une demande entrante" />
        <div className="thread-body" ref={zone}>
          {messages.map((m) => (
            <div key={m.id} className={`thread-msg ${m.role === "ia" ? "ia" : "client"}`}>
              <p>{m.texte}</p>
              <span>{m.role === "ia" ? "Agent IA Habti" : "Prospect"}</span>
            </div>
          ))}
        </div>
        <div className="thread-composer">
          <TextArea value={saisie} onChange={(e) => setSaisie(e.currentTarget.value)} placeholder="Répondez comme le prospect (ex. : Marrakech, 12 personnes, budget 9000 €)…"
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); envoyer(); } }} />
          <div className="composer-actions">
            <Button variant="outline" onClick={() => { setMessages([{ id: newId("m"), role: "ia", texte: questions[0]! }]); setEtape(0); setFiche(ficheVide); setSuggestions([]); notify("Nouvelle conversation démarrée."); }}>Nouvelle conversation</Button>
            <Button onClick={envoyer} disabled={!saisie.trim()}><Send />Envoyer</Button>
          </div>
        </div>
      </Panel>

      <Panel className="ai-side">
        <PanelTitle title="Fiche extraite automatiquement" subtitle="Mise à jour à chaque réponse du prospect" />
        <div className="data-grid">
          <div><span>Ville</span><b>{fiche.ville}</b></div>
          <div><span>Dates</span><b>{fiche.dates}</b></div>
          <div><span>Personnes</span><b>{fiche.personnes}</b></div>
          <div><span>Budget</span><b>{fiche.budget}</b></div>
          <div><span>Type de voyage</span><b>{fiche.typeVoyage}</b></div>
          <div><span>Activité</span><b>{fiche.activite}</b></div>
          <div><span>Mood</span><b>{fiche.mood}</b></div>
          <div><span>Préférences</span><b>{fiche.preferences}</b></div>
        </div>
        <div className="capacity">
          <div><span>Niveau d'intérêt</span><StatutBadge statut={niveau === "Très chaud" ? "Qualifié" : "À qualifier"} /></div>
          <Progress value={fiche.interet} />
          <b>{fiche.interet} / 100</b>
        </div>

        {suggestions.length > 0 && (
          <div className="ia-summary">
            <h4><Sparkles />Suggestions générées</h4>
            <ul>{suggestions.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        )}

        <div className="drawer-actions column">
          <Button onClick={enregistrer}><UserPlus />Enregistrer comme prospect</Button>
          <Button variant="outline" onClick={() => notify("Fiche prospect mise à jour.")}>Mettre à jour la fiche</Button>
          <Button variant="outline" onClick={() => {
            setSuggestions([
              `Bivouac de luxe à Merzouga — 2 nuits — ${euro(1450)} / personne`,
              `Montgolfière au lever du soleil à Marrakech — ${euro(220)} / personne`,
              `Dîner spectacle privatisé au palais Jad Mahal — ${euro(95)} / personne`,
            ]);
            notify("Suggestions générées par l'IA.");
          }}><Sparkles />Générer des suggestions</Button>
          <Button variant="outline" onClick={() => navigate({ to: "/devis", search: { nouveau: "1" } })}>Créer un devis</Button>
          <Button variant="outline" onClick={() => navigate({ to: "/reservations", search: { nouveau: "1" } })}>Créer une réservation</Button>
          <Button variant="outline" onClick={() => notify("Conversation transférée à un conseiller.")}>Transférer à un conseiller</Button>
        </div>
      </Panel>
    </div>
  );
}
