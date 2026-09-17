import logoHabti from "@/assets/habti/habti-logo-officiel.png";

export function HabtiLogo({ variant = "full", className = "" }: { variant?: "full" | "symbol"; className?: string }) {
  return (
    <span className={`habti-logo ${variant === "symbol" ? "is-symbol" : ""} ${className}`} role="img" aria-label="HABTI — Depuis 1978">
      <img src={logoHabti} alt="HABTI GROUP — MICE DMC PCO" className="habti-logo-image" />
    </span>
  );
}
