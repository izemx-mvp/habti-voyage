import type { ComponentType, FormEvent, ReactNode } from "react";
import { ArrowUpRight, ChevronDown, Inbox, MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Panel({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`panel ${className}`}>{children}</div>;
}

export function PanelTitle({ title, subtitle, action, onAction }: { title: string; subtitle?: string; action?: string; onAction?: () => void }) {
  return (
    <div className="panel-title">
      <div>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action && (
        <Button variant="ghost" onClick={onAction} type="button">
          {action}
          <ChevronDown />
        </Button>
      )}
    </div>
  );
}

export function Metric({ label, value, delta, icon: Icon, tone = "green", onClick }: {
  label: string; value: string; delta?: string; icon: ComponentType<{ className?: string }>; tone?: string; onClick?: () => void;
}) {
  return (
    <button type="button" className={`metric-card ${onClick ? "is-clickable" : ""}`} onClick={onClick} disabled={!onClick}>
      <div className={`metric-icon ${tone}`}><Icon /></div>
      <div className="metric-top"><span>{label}</span><MoreHorizontal /></div>
      <strong>{value}</strong>
      {delta && <small><ArrowUpRight />{delta}<i> vs mois dernier</i></small>}
    </button>
  );
}

const TONES: Record<string, string> = {
  Nouveau: "info", "À qualifier": "warn", Qualifié: "ok", "Proposition à préparer": "warn",
  "Devis envoyé": "info", "En attente": "warn", "Réservation confirmée": "ok", Client: "ok", Perdu: "bad",
  "Demande reçue": "info", "Suggestion envoyée": "info", Réservée: "info", Confirmée: "ok",
  "En cours": "warn", Terminée: "ok", Annulée: "bad",
  Brouillon: "muted", "À valider": "warn", Envoyé: "info", Accepté: "ok", Refusé: "bad", Expiré: "bad",
  "Non payé": "bad", "Acompte reçu": "info", "Partiellement payé": "warn", Payé: "ok", "En retard": "bad", Remboursé: "muted",
  "À planifier": "muted", Planifiée: "info", Affectée: "info",
  "Pris en charge par l'IA": "info", "Transféré à un conseiller": "warn", Résolu: "ok", Fermé: "muted",
  Disponible: "ok", "En mission": "warn", Congé: "muted", Active: "ok", Désactivée: "muted",
};

export function StatutBadge({ statut }: { statut: string }) {
  return <Badge variant="outline" className={`statut statut-${TONES[statut] ?? "muted"}`}>{statut}</Badge>;
}

export function FormModal({ open, onOpenChange, title, description, submitLabel = "Enregistrer", onSubmit, children, wide }: {
  open: boolean; onOpenChange: (o: boolean) => void; title: string; description?: string;
  submitLabel?: string; onSubmit: (e: FormEvent<HTMLFormElement>) => void; children: ReactNode; wide?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={wide ? "habti-modal habti-modal-wide" : "habti-modal"}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="form-grid">{children}</div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ConfirmDialog({ open, onOpenChange, titre = "Êtes-vous sûr de vouloir supprimer cet élément ?", description, onConfirm, confirmLabel = "Confirmer la suppression" }: {
  open: boolean; onOpenChange: (o: boolean) => void; titre?: string; description?: string; onConfirm: () => void; confirmLabel?: string;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{titre}</AlertDialogTitle>
          <AlertDialogDescription>{description ?? "Cette action est définitive et ne pourra pas être annulée."}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function Field({ label, children, full }: { label: string; children: ReactNode; full?: boolean }) {
  return (
    <label className={`field ${full ? "field-full" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="habti-input" {...props} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="habti-input" rows={3} {...props} />;
}

export function SelectInput({ options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { options: readonly string[] }) {
  return (
    <select className="habti-input" {...props}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export function FilterSelect({ label, value, options, onChange }: {
  label: string; value: string; options: readonly string[]; onChange: (v: string) => void;
}) {
  return (
    <select className={`filter-select ${value !== "Tous" ? "is-active" : ""}`} value={value} onChange={(e) => onChange(e.currentTarget.value)} aria-label={label}>
      <option value="Tous">{label}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export function ActiveChips({ chips, onClear, onRemove }: { chips: { label: string; value: string }[]; onClear: () => void; onRemove: (label: string) => void }) {
  if (!chips.length) return null;
  return (
    <div className="active-chips">
      {chips.map((c) => (
        <button key={c.label} type="button" onClick={() => onRemove(c.label)}>
          {c.label} : <b>{c.value}</b><X />
        </button>
      ))}
      <button type="button" className="chip-clear" onClick={onClear}>Réinitialiser les filtres</button>
    </div>
  );
}

export function RowMenu({ actions }: { actions: { label: string; onSelect: () => void; danger?: boolean }[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Plus d'actions" onClick={(e) => e.stopPropagation()}><MoreHorizontal /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((a) => (
          <DropdownMenuItem key={a.label} className={a.danger ? "text-destructive" : undefined}
            onClick={(e) => { e.stopPropagation(); a.onSelect(); }}>
            {a.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function EmptyState({ titre, description, ctaLabel, onCta, icon: Icon = Inbox }: {
  titre: string; description?: string; ctaLabel?: string; onCta?: () => void; icon?: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><Icon /></div>
      <h3>{titre}</h3>
      {description && <p>{description}</p>}
      {ctaLabel && onCta && <Button onClick={onCta}>{ctaLabel}</Button>}
    </div>
  );
}

export function Pager({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  if (pages <= 1) return null;
  return (
    <div className="pager">
      <Button variant="outline" size="sm" disabled={page === 1} onClick={() => onPage(page - 1)}>Précédent</Button>
      <span>Page {page} sur {pages}</span>
      <Button variant="outline" size="sm" disabled={page === pages} onClick={() => onPage(page + 1)}>Suivant</Button>
    </div>
  );
}
