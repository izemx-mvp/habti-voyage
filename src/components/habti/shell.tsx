import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, ChevronLeft, LogOut, Menu, Moon, PanelLeftClose, Plus, Search, Settings2, Sun, User } from "lucide-react";
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
  const { notify, prospects, clients, reservations, devis, missions, socialPosts, campagnes } = useHabti();
  const [reduit, setReduit] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [palette, setPalette] = useState(false);
  const [theme, setTheme] = useState<"clair" | "sombre">("clair");
  const meta = pageMeta[path] ?? { titre: "Habti Voyage", sous: "" };
  const entites = [
    ...prospects.map((p) => ({ type: "Prospect", label: `${p.prenom} ${p.nom}`, detail: `${p.ville} · ${p.statut}`, to: "/prospects/$id" as const, id: p.id })),
    ...clients.map((c) => ({ type: "Client", label: c.nom, detail: `${c.ville} · ${c.segment}`, to: "/clients/$id" as const, id: c.id })),
    ...reservations.map((r) => ({ type: "Réservation", label: r.reference, detail: `${r.client} · ${r.prestation}`, to: "/reservations/$id" as const, id: r.id })),
    ...devis.map((d) => ({ type: "Devis", label: d.reference, detail: `${d.client} · ${d.statut}`, to: "/devis/$id" as const, id: d.id })),
    ...missions.map((m) => ({ type: "Opération", label: m.titre, detail: `${m.client} · ${m.statut}`, to: "/operations/$id" as const, id: m.id })),
    ...socialPosts.map((post) => ({ type: "Publication", label: post.titre, detail: `${post.type} · ${post.statut}`, to: "/community-manager/idees/$id" as const, id: post.id })),
    ...campagnes.map((c) => ({ type: "Campagne", label: c.nom, detail: `${c.canal} · ${c.statut}`, to: "/campagnes/$id" as const, id: c.id })),
  ];

  useEffect(() => {
    const saved = window.localStorage.getItem("habti-theme");
    const initial = saved === "sombre" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "sombre" : "clair";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "sombre");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setPalette((v) => !v); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleTheme = () => {
    const next = theme === "clair" ? "sombre" : "clair";
    setTheme(next);
    window.localStorage.setItem("habti-theme", next);
    document.documentElement.classList.toggle("dark", next === "sombre");
  };

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
          <Button variant="ghost" size="icon" aria-label={theme === "clair" ? "Activer le mode sombre" : "Activer le mode clair"} title={theme === "clair" ? "Mode sombre" : "Mode clair"} onClick={toggleTheme}>
            {theme === "clair" ? <Moon /> : <Sun />}
          </Button>

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
              <DropdownMenuItem onClick={() => navigate({ to: "/parametres-compte" })}><User />Mon profil</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/parametres" })}><Settings2 />Paramètres entreprise</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { notify("Vous avez été déconnectée de la démonstration."); navigate({ to: "/connexion" }); }}><LogOut />Se déconnecter</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="shell-content">{children}</main>
      </div>

      <CommandDialog open={palette} onOpenChange={setPalette}>
        <CommandInput placeholder="Rechercher une page, un client, un devis, une opération…" />
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
          <CommandGroup heading="DOSSIERS">
            {entites.slice(0, 18).map((e) => (
              <CommandItem key={`${e.type}-${e.id}`} value={`${e.type} ${e.label} ${e.detail}`} onSelect={() => { setPalette(false); navigate({ to: e.to, params: { id: e.id } }); }}>
                <Search />
                <div className="command-entity"><b>{e.label}</b><span>{e.type} · {e.detail}</span></div>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="ACTIONS RAPIDES">
            <CommandItem value="Nouveau prospect" onSelect={() => { setPalette(false); navigate({ to: "/prospects", search: { nouveau: "1" } }); }}>Créer un prospect</CommandItem>
            <CommandItem value="Nouvelle réservation" onSelect={() => { setPalette(false); navigate({ to: "/reservations", search: { nouveau: "1" } }); }}>Créer une réservation</CommandItem>
            <CommandItem value="Nouveau devis" onSelect={() => { setPalette(false); navigate({ to: "/devis", search: { nouveau: "1" } }); }}>Créer un devis</CommandItem>
            <CommandItem value="Nouvelle campagne" onSelect={() => { setPalette(false); navigate({ to: "/campagnes", search: { nouveau: "1" } }); }}>Créer une campagne</CommandItem>
            <CommandItem value="Nouvelle publication" onSelect={() => { setPalette(false); navigate({ to: "/community-manager/idees" }); }}>Créer une publication</CommandItem>
            <CommandItem value="Planning éditorial" onSelect={() => { setPalette(false); navigate({ to: "/community-manager/planning" }); }}>Ouvrir le planning éditorial</CommandItem>
            <CommandItem value="Enregistrer un paiement" onSelect={() => { setPalette(false); navigate({ to: "/paiements", search: { nouveau: "1" } }); }}>Enregistrer un paiement</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
