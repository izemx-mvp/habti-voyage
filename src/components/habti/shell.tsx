import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronLeft, LogOut, Menu, PanelLeftClose, Plus, Search, Settings2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { HabtiLogo } from "@/components/habti/logo";
import { navGroups, pageMeta } from "@/components/habti/nav";
import { useHabti } from "@/lib/habti-store";

const notifications = [
  { id: "n1", titre: "Nouveau prospect qualifié", detail: "Sofia Martinez — Merzouga, 4 personnes" },
  { id: "n2", titre: "Acompte reçu", detail: "Groupe Atlas Creative — 3 600 €" },
  { id: "n3", titre: "Mission à affecter", detail: "Excursion désert du 18 septembre" },
];

export function HabtiShell({ path, children }: { path: string; children: ReactNode }) {
  const navigate = useNavigate();
  const { notify } = useHabti();
  const [reduit, setReduit] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [palette, setPalette] = useState(false);
  const meta = pageMeta[path] ?? { titre: "Habti Voyage", sous: "" };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setPalette((v) => !v); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const Nav = ({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) => (
    <nav className="sidebar-nav">
      {navGroups.map((g) => (
        <div className="nav-group" key={g.label}>
          {!compact && <p>{g.label}</p>}
          {g.items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className="nav-link"
              activeProps={{ className: "nav-link active" }}
              title={item.label}
            >
              <item.icon />
              {!compact && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
      ))}
    </nav>
  );

  return (
    <div className={`habti-shell ${reduit ? "is-collapsed" : ""}`}>
      <div className="mirror-field" aria-hidden="true">
        <span className="wave w1" /><span className="wave w2" /><span className="wave w3" />
      </div>

      <aside className="sidebar">
        <div className="sidebar-head">
          <HabtiLogo variant={reduit ? "symbol" : "full"} />
          <Button variant="ghost" size="icon" aria-label={reduit ? "Déplier le menu" : "Réduire le menu"} onClick={() => setReduit((v) => !v)}>
            {reduit ? <ChevronLeft className="rotate-180" /> : <PanelLeftClose />}
          </Button>
        </div>
        <Nav compact={reduit} />
        <div className="sidebar-foot">
          {!reduit && <p>Habti Voyage — Depuis 1978</p>}
          <Button variant="outline" size={reduit ? "icon" : "default"} onClick={() => navigate({ to: "/parametres" })}>
            <Settings2 />{!reduit && "Paramètres"}
          </Button>
        </div>
      </aside>

      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent side="left" className="mobile-nav">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="sidebar-head"><HabtiLogo /></div>
          <Nav onNavigate={() => setMobile(false)} />
        </SheetContent>
      </Sheet>

      <div className="shell-main">
        <header className="topbar">
          <Button variant="ghost" size="icon" className="mobile-only" aria-label="Ouvrir le menu" onClick={() => setMobile(true)}><Menu /></Button>
          <div>
            <h1>{meta.titre}</h1>
            <p>{meta.sous}</p>
          </div>
          <button type="button" className="global-search" onClick={() => setPalette(true)}>
            <Search /><span>Rechercher un client, un devis, une activité…</span><kbd>Ctrl K</kbd>
          </button>
          <Button className="quick-button" onClick={() => navigate({ to: "/reservations", search: { nouveau: "1" } })}><Plus />Nouvelle réservation</Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Notifications" className="bell"><Bell /><Badge className="bell-dot">{notifications.length}</Badge></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="notif-menu">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((n) => (
                <DropdownMenuItem key={n.id} onClick={() => { navigate({ to: "/dashboard" }); notify("Notification ouverte."); }}>
                  <div><b>{n.titre}</b><span>{n.detail}</span></div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => notify("Toutes les notifications ont été marquées comme lues.")}>Tout marquer comme lu</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="profile-chip">
                <Avatar><AvatarFallback>SB</AvatarFallback></Avatar>
                <span><b>Salma Bennani</b><small>Directrice commerciale</small></span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/parametres" })}><User />Mon profil</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/parametres" })}><Settings2 />Paramètres</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => notify("Vous avez été déconnectée de la démonstration.")}><LogOut />Se déconnecter</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="shell-content">{children}</main>
      </div>

      <CommandDialog open={palette} onOpenChange={setPalette}>
        <CommandInput placeholder="Rechercher une page ou une action…" />
        <CommandList>
          <CommandEmpty>Aucun résultat.</CommandEmpty>
          {navGroups.map((g) => (
            <CommandGroup heading={g.label} key={g.label}>
              {g.items.map((item) => (
                <CommandItem key={item.path} value={item.label} onSelect={() => { setPalette(false); navigate({ to: item.path }); }}>
                  <item.icon />{item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandGroup heading="ACTIONS RAPIDES">
            <CommandItem value="Nouveau prospect" onSelect={() => { setPalette(false); navigate({ to: "/prospects", search: { nouveau: "1" } }); }}>Créer un prospect</CommandItem>
            <CommandItem value="Nouvelle réservation" onSelect={() => { setPalette(false); navigate({ to: "/reservations", search: { nouveau: "1" } }); }}>Créer une réservation</CommandItem>
            <CommandItem value="Nouveau devis" onSelect={() => { setPalette(false); navigate({ to: "/devis", search: { nouveau: "1" } }); }}>Créer un devis</CommandItem>
            <CommandItem value="Enregistrer un paiement" onSelect={() => { setPalette(false); navigate({ to: "/paiements", search: { nouveau: "1" } }); }}>Enregistrer un paiement</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
