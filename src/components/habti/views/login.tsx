import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HabtiLogo } from "@/components/habti/logo";
import { useHabti } from "@/lib/habti-store";

const DESTINATIONS = [
  { nom: "Tanger", x: 30, y: 12 },
  { nom: "Essaouira", x: 18, y: 46 },
  { nom: "Marrakech", x: 46, y: 52 },
  { nom: "Merzouga", x: 78, y: 40 },
  { nom: "Agadir", x: 24, y: 74 },
];

const COMPTE_DEMO = { email: "salma@habtivoyage.com", password: "habti2026" };

export function LoginView() {
  const navigate = useNavigate();
  const { notify } = useHabti();
  const [email, setEmail] = useState(COMPTE_DEMO.email);
  const [password, setPassword] = useState(COMPTE_DEMO.password);
  const [voirMdp, setVoirMdp] = useState(false);
  const [souvenir, setSouvenir] = useState(true);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");
    if (email.trim().toLowerCase() !== COMPTE_DEMO.email || password !== COMPTE_DEMO.password) {
      setErreur("Adresse e-mail ou mot de passe incorrect.");
      return;
    }
    setChargement(true);
    window.setTimeout(() => {
      notify("Connexion réussie. Bienvenue Salma.");
      navigate({ to: "/dashboard" });
    }, 900);
  };

  return (
    <main className="login-experience">
      <section className="login-visual" aria-hidden="true">
        <div className="mirror-field"><span className="wave w1" /><span className="wave w2" /><span className="wave w3" /></div>
        <div className="login-collage">
          <span className="shape shape-dune" />
          <span className="shape shape-medina" />
          <span className="shape shape-atlas" />
          <span className="shape shape-ocean" />
          <div className="login-particles">{Array.from({ length: 14 }).map((_, i) => <i key={i} style={{ ["--i" as string]: i }} />)}</div>
          <svg className="travel-map" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path className="route-glow" d="M30 12 C 20 28, 14 36, 18 46 C 24 52, 38 46, 46 52 C 58 60, 68 48, 78 40" />
            <path className="route-line" d="M30 12 C 20 28, 14 36, 18 46 C 24 52, 38 46, 46 52 C 58 60, 68 48, 78 40" />
            <path className="route-line route-line-2" d="M18 46 C 20 58, 22 66, 24 74" />
          </svg>
          {DESTINATIONS.map((d, i) => (
            <span className="destination" key={d.nom} style={{ left: `${d.x}%`, top: `${d.y}%`, ["--d" as string]: `${i * 0.6}s` }}>
              <i /><b>{d.nom}</b>
            </span>
          ))}
        </div>
        <div className="login-brandline">
          <h1>Explorez. Imaginez. Organisez.</h1>
          <p>L’expérience HABTI, depuis 1978.</p>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <HabtiLogo />
          <div className="login-copy">
            <h2>Bienvenue</h2>
            <p>Accédez à votre espace HABTI.</p>
          </div>
          <form onSubmit={submit} className="login-form" noValidate>
            <div className={`float-field ${email ? "filled" : ""}`}>
              <Mail />
              <input id="login-email" type="email" value={email} onChange={(e) => { setEmail(e.currentTarget.value); setErreur(""); }} placeholder=" " autoComplete="email" />
              <label htmlFor="login-email">Adresse e-mail</label>
            </div>
            <div className={`float-field ${password ? "filled" : ""}`}>
              <Lock />
              <input id="login-password" type={voirMdp ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.currentTarget.value); setErreur(""); }} placeholder=" " autoComplete="current-password" />
              <label htmlFor="login-password">Mot de passe</label>
              <button type="button" className="reveal" onClick={() => setVoirMdp((v) => !v)} aria-label={voirMdp ? "Masquer le mot de passe" : "Afficher le mot de passe"}>
                {voirMdp ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {erreur && <p className="login-error" role="alert"><ShieldCheck />{erreur}</p>}
            <div className="login-options">
              <label className="remember">
                <input type="checkbox" checked={souvenir} onChange={(e) => setSouvenir(e.currentTarget.checked)} />
                <span>Se souvenir de moi</span>
              </label>
              <button type="button" className="link-btn" onClick={() => notify("Un lien de réinitialisation a été envoyé (démonstration).")}>Mot de passe oublié ?</button>
            </div>
            <Button type="submit" className="login-submit" disabled={chargement || !email || !password}>
              {chargement ? <><Loader2 className="spin" />Connexion en cours…</> : <>Se connecter<ArrowRight /></>}
            </Button>
          </form>
          <p className="login-secure"><Lock />Connexion sécurisée à votre espace HABTI</p>
        </div>
      </section>
    </main>
  );
}
