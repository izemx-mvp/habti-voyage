import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HabtiLogo } from "@/components/habti/logo";
import { Field, TextInput } from "@/components/habti/ui-bits";
import { useHabti } from "@/lib/habti-store";

export function LoginView() {
  const navigate = useNavigate();
  const { notify } = useHabti();
  const [email, setEmail] = useState("salma@habtivoyage.com");
  const [password, setPassword] = useState("demo-habti");
  const submit = (e: React.FormEvent) => { e.preventDefault(); notify("Connexion de démonstration réussie."); navigate({ to: "/dashboard" }); };
  return <main className="login-page"><div className="mirror-field" aria-hidden="true"><span className="wave w1" /><span className="wave w2" /><span className="wave w3" /></div><section className="login-card"><HabtiLogo /><div className="login-copy"><span><Sparkles />Plateforme opérationnelle premium</span><h1>Bienvenue chez HABTI Voyage</h1><p>Connectez-vous à l'espace de pilotage voyages, événements, opérations et relation client.</p></div><form onSubmit={submit} className="login-form"><Field label="Adresse e-mail"><div className="input-icon"><Mail /><TextInput type="email" value={email} onChange={(e)=>setEmail(e.currentTarget.value)} required /></div></Field><Field label="Mot de passe"><div className="input-icon"><Lock /><TextInput type="password" value={password} onChange={(e)=>setPassword(e.currentTarget.value)} required /></div></Field><Button type="submit" disabled={!email || !password}>Entrer dans la plateforme<ArrowRight /></Button><Button type="button" variant="outline" onClick={()=>notify("Lien magique envoyé en démonstration.")}>Recevoir un lien magique</Button></form><div className="login-proof"><ShieldCheck /><span>Démo locale sécurisée · données réalistes marocaines</span></div></section></main>;
}
