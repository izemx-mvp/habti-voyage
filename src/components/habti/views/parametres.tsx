import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Field, Panel, PanelTitle, SelectInput, TextArea, TextInput } from "@/components/habti/ui-bits";
import { HabtiLogo } from "@/components/habti/logo";
import { useHabti } from "@/lib/habti-store";

const ONGLETS = [
  ["entreprise", "Entreprise"],
  ["equipe", "Équipe & accès"],
  ["notifications", "Notifications"],
] as const;

export function ParametresView() {
  const { employes, notify } = useHabti();
  const [onglet, setOnglet] = useState<(typeof ONGLETS)[number][0]>("entreprise");
  const [alertes, setAlertes] = useState({ reservations: true, paiements: true, missions: false, suggestions: true });

  return (
    <div className="module-stack">
      <div className="drawer-tabs">
        {ONGLETS.map(([id, label]) => (
          <button key={id} className={onglet === id ? "active" : ""} onClick={() => setOnglet(id)}>{label}</button>
        ))}
      </div>

      {onglet === "entreprise" && (
        <Panel>
          <PanelTitle title="Informations de l'entreprise" subtitle="Ces données apparaissent sur les devis et les factures" />
          <div className="settings-brand"><HabtiLogo /><p>Logo utilisé sur les documents commerciaux et dans l'application.</p></div>
          <form className="form-grid" onSubmit={(e) => { e.preventDefault(); notify("Informations enregistrées."); }}>
            <Field label="Raison sociale"><TextInput defaultValue="Habti Voyage" /></Field>
            <Field label="Année de création"><TextInput defaultValue="1978" /></Field>
            <Field label="Adresse" full><TextInput defaultValue="Avenue Mohammed V, Marrakech, Maroc" /></Field>
            <Field label="Téléphone"><TextInput defaultValue="+212 524 43 18 78" /></Field>
            <Field label="E-mail"><TextInput type="email" defaultValue="contact@habtivoyage.com" /></Field>
            <Field label="Devise"><SelectInput options={["Euro (€)", "Dirham (MAD)"]} /></Field>
            <Field label="TVA appliquée (%)"><TextInput type="number" defaultValue={20} /></Field>
            <Field label="Mentions légales sur les documents" full><TextArea defaultValue="Habti Voyage — Agence de voyages et d'événements au Maroc — Depuis 1978." /></Field>
            <div className="field-full drawer-actions"><Button type="submit"><Save />Enregistrer les modifications</Button></div>
          </form>
        </Panel>
      )}

      {onglet === "equipe" && (
        <Panel>
          <PanelTitle title="Équipe et accès" subtitle="Rôles et permissions des utilisateurs Habti Voyage" />
          <div className="table-wrap">
            <table>
              <thead><tr><th>Utilisateur</th><th>Rôle</th><th>Ville</th><th>Accès</th></tr></thead>
              <tbody>
                {employes.map((e) => (
                  <tr key={e.id}>
                    <td><b>{e.nom}</b></td>
                    <td>{e.role}</td>
                    <td>{e.ville}</td>
                    <td>
                      <select className="habti-input" defaultValue="Conseiller" onChange={() => notify("Niveau d'accès mis à jour.")}>
                        <option>Administrateur</option><option>Conseiller</option><option>Opérations</option><option>Lecture seule</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {onglet === "notifications" && (
        <Panel>
          <PanelTitle title="Notifications" subtitle="Choisissez les alertes que vous souhaitez recevoir" />
          {([["reservations", "Nouvelles réservations"], ["paiements", "Paiements et relances"], ["missions", "Missions du jour"], ["suggestions", "Suggestions des agents"]] as const).map(([cle, label]) => (
            <div className="switch-row" key={cle}>
              <div><b>{label}</b><span>Recevoir une alerte dans l'application et par e-mail.</span></div>
              <Switch checked={alertes[cle]} onCheckedChange={(v) => { setAlertes((a) => ({ ...a, [cle]: v })); notify(v ? `${label} : alertes activées.` : `${label} : alertes désactivées.`); }} />
            </div>
          ))}
          <div className="drawer-actions"><Button onClick={() => notify("Préférences de notification enregistrées.")}><Save />Enregistrer</Button></div>
        </Panel>
      )}
    </div>
  );
}
