/**
 * Logo officiel HABTI.
 * Point unique de vérité : remplacer l'image ici met à jour toute l'application
 * (barre latérale, en-tête, écran de connexion, devis, factures, aperçus PDF).
 */
export function HabtiLogo({ variant = "full", className = "" }: { variant?: "full" | "symbol"; className?: string }) {
  return (
    <span className={`habti-logo ${variant === "symbol" ? "is-symbol" : ""} ${className}`} role="img" aria-label="HABTI — Depuis 1978">
      <svg viewBox="0 0 48 48" className="habti-logo-mark" aria-hidden="true">
        <circle cx="24" cy="24" r="22" className="ring" />
        <path d="M9 27.5 39 14l-8.4 16.3-5.8-3.4-3.1 6.2-2.1-6.6Z" className="plane" />
      </svg>
      {variant === "full" && (
        <span className="habti-logo-text">
          <strong>HABTI</strong>
          <small>Depuis 1978</small>
        </span>
      )}
    </span>
  );
}
