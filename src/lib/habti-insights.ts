import { dateFr, euro, type Client, type Prestation, type Prospect, type SocialPost } from "./habti-data";

const hash = (s: string) => s.split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 9973, 7);
const pick = <T,>(arr: readonly T[], seed: number) => arr[seed % arr.length] as T;
const clamp = (n: number) => Math.max(8, Math.min(98, Math.round(n)));

export type KpiIA = { label: string; valeur: number; suffixe?: string };

export function prospectAnalyse(p: Prospect) {
  const h = hash(p.id);
  const kpis: KpiIA[] = [
    { label: "Score de qualification", valeur: clamp(p.score) },
    { label: "Probabilité de conversion", valeur: clamp(p.score - 6 + (h % 9)) },
    { label: "Niveau d'engagement", valeur: clamp(52 + (h % 40)) },
    { label: "Urgence", valeur: clamp(40 + (h % 50)) },
    { label: "Compatibilité budget", valeur: clamp(p.budget > 8000 ? 88 : 62 + (h % 25)) },
    { label: "Maturité du besoin", valeur: clamp(p.score - 10 + (h % 20)) },
  ];
  return {
    kpis,
    mood: p.mood,
    intent: `${p.typeDemande} ${p.mood.toLowerCase()} à ${p.ville}`,
    freins: [
      p.budget < 5000 ? "Budget serré par rapport à la demande" : "Validation budgétaire interne à obtenir",
      "Dates encore flexibles",
      pick(["Attente d'un accord conjoint", "Comparaison avec une autre agence", "Contraintes de transport"], h),
    ],
    interets: [p.ville, p.mood, ...p.activites.split(",").map((a) => a.trim()).filter(Boolean)],
    signaux: [
      "Deux demandes d'information tarifaire",
      `Ouverture des messages HABTI (${60 + (h % 35)} %)`,
      pick(["Demande de disponibilité précise", "Consultation répétée du catalogue", "Réponse en moins d'une heure"], h + 3),
    ],
    resume: `Le prospect montre un fort intérêt pour une expérience ${p.mood.toLowerCase()} à ${p.ville} pour ${p.personnes} personne(s), avec un budget autour de ${euro(p.budget)}. Une relance personnalisée avec 3 expériences adaptées est recommandée.`,
    prochaineAction: `Envoyer une proposition ${p.mood.toLowerCase()} avec 3 expériences à ${p.ville} avant le ${dateFr(p.dateSouhaitee)}.`,
    criteres: [p.ville, `${p.personnes} personne(s)`, p.mood, p.typeDemande, `Budget ${euro(p.budget)}`, "Premium"],
  };
}

export function prospectConversations(p: Prospect) {
  const h = hash(p.id);
  const canal = pick(["WhatsApp", "Email", "Instagram", "Facebook", "Site web"], h);
  return [
    {
      id: `${p.id}-c1`, canal, date: dateFr(p.createdAt), mode: "Agent IA" as const,
      resume: `Premier contact ${canal.toLowerCase()} : qualification automatique de la demande.`,
      messages: [
        { auteur: "Prospect", texte: `Bonjour, je cherche une expérience ${p.mood.toLowerCase()} à ${p.ville} pour ${p.personnes} personne(s).`, heure: "09:12" },
        { auteur: "Agent IA", texte: `Bonjour ${p.prenom}, avec plaisir. Quelles dates envisagez-vous et quel budget approximatif ?`, heure: "09:13" },
        { auteur: "Prospect", texte: `Autour du ${dateFr(p.dateSouhaitee)}, budget ${euro(p.budget)}.`, heure: "09:21" },
      ],
    },
    {
      id: `${p.id}-c2`, canal: "Email", date: dateFr(p.createdAt), mode: "Conseiller HABTI" as const,
      resume: `${p.conseiller} a repris la main pour présenter deux expériences adaptées.`,
      messages: [
        { auteur: p.conseiller, texte: `Bonjour ${p.prenom}, voici deux propositions correspondant à votre demande à ${p.ville}.`, heure: "14:02" },
        { auteur: "Prospect", texte: "Merci, la première option nous intéresse beaucoup. Pouvez-vous chiffrer ?", heure: "16:44" },
      ],
    },
  ];
}

export function prospectSuggestions(p: Prospect, prestations: Prestation[]) {
  const scored = prestations
    .map((x) => {
      let s = 55;
      if (x.ville === p.ville) s += 22;
      if (x.moods.includes(p.mood)) s += 18;
      if (x.prix * p.personnes <= p.budget) s += 12;
      return { prestation: x, score: Math.min(99, s) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  return scored.map(({ prestation, score }) => ({
    prestation, score,
    pourquoi: `Cette expérience correspond au souhait de découvrir ${p.ville} dans un cadre ${p.mood.toLowerCase()} et premium, pour ${p.personnes} personne(s).`,
  }));
}

export function prospectDocuments(p: Prospect) {
  const h = hash(p.id);
  return [
    { id: `${p.id}-d1`, nom: `Brief demande — ${p.prenom} ${p.nom}.pdf`, type: "PDF", date: dateFr(p.createdAt), taille: `${180 + (h % 120)} Ko`, statut: "Validé" },
    { id: `${p.id}-d2`, nom: `Proposition ${p.ville}.pdf`, type: "PDF", date: dateFr(p.dateSouhaitee), taille: `${420 + (h % 300)} Ko`, statut: "Envoyé" },
    { id: `${p.id}-d3`, nom: "Conditions générales HABTI.pdf", type: "PDF", date: "12/09/2026", taille: "96 Ko", statut: "Partagé" },
  ];
}

export function clientAnalyse(c: Client) {
  const h = hash(c.id);
  return {
    experiences: pick([["Désert & bivouac", "Dîner spectacle"], ["Riads & hammam", "Visites culturelles"], ["Team building", "Séminaires"]], h),
    engagement: clamp(58 + (h % 38)),
    frequence: `${Math.max(1, Math.round(c.reservations / 2))} réservations par an`,
    panierMoyen: c.reservations ? Math.round(c.chiffreAffaires / c.reservations) : 0,
    prochaine: pick(["Montgolfière au lever du jour", "Nuit privée sous les étoiles", "Collection riads de la Médina", "Team Building Agafay"], h + 2),
    villes: pick([["Marrakech", "Merzouga"], ["Essaouira", "Agadir"], ["Casablanca", "Rabat"]], h + 1),
    derniere: "Il y a 6 jours · WhatsApp",
  };
}

export function postHistorique(post: SocialPost) {
  const base = dateFr(post.date);
  const lignes = [
    { texte: `Contenu créé (${post.origine === "IA" ? "génération IA" : "saisie manuelle"})`, date: base },
    { texte: "Contenu modifié par Salma Bennani", date: base },
  ];
  if (["Validé", "Planifié", "Publié"].includes(post.statut)) lignes.push({ texte: "Contenu validé par un humain", date: base });
  if (["Planifié", "Publié"].includes(post.statut)) lignes.push({ texte: `Planifié le ${base} à ${post.heure}`, date: base });
  if (post.statut === "Publié") lignes.push({ texte: `Publié sur ${post.plateformes.join(", ")}`, date: base });
  return lignes.reverse();
}

export function postSuggestions(post: SocialPost) {
  return [
    { id: "accroche", titre: "Amélioration de l'accroche", texte: `${post.titre} : et si vous viviez ce moment autrement ?`, champ: "titre" as const },
    { id: "caption", titre: "Légende alternative", texte: `${post.legende.split(".")[0]}. Une parenthèse confidentielle signée HABTI, depuis 1978.`, champ: "legende" as const },
    { id: "hashtags", titre: "Hashtags suggérés", texte: `${post.hashtags} #ExperienceMaroc #SurMesure`, champ: "hashtags" as const },
    { id: "cta", titre: "CTA suggéré", texte: "Demander votre programme personnalisé", champ: "cta" as const },
    { id: "adaptation", titre: "Adaptation plateforme", texte: `Version courte optimisée pour ${post.plateformes[0] ?? "Instagram"} : accroche en 1 ligne, 5 hashtags maximum.`, champ: "legende" as const },
    { id: "ton", titre: "Amélioration du ton", texte: `${post.legende} Un accompagnement humain à chaque étape.`, champ: "legende" as const },
  ];
}
