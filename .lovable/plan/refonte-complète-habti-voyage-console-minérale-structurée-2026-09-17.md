# Refonte complète HABTI Voyage — Console minérale structurée

## Direction retenue
- Préserver le logo officiel, tous les modules, routes, données, règles métier et interactions existantes.
- Appliquer la palette Jardin minéral : fond `#F5F6F2`, encre `#23352F`, action `#2F7D5B`, neutre `#8B9D8E`.
- Utiliser DM Serif Display pour les titres et Fira Sans pour l’interface.
- Faire du mode clair le défaut et concevoir un mode sombre dédié, persistant et compatible avec la préférence système.
- Décliner la composition « Console minérale structurée » : navigation calme, en-tête compact, grille dense et surfaces sobres.

## Mise en œuvre
1. **Fondations** — unifier les jetons de couleur, typographie, espacements, rayons, élévation, états et mouvement; supprimer les règles visuelles contradictoires sans toucher aux comportements.
2. **Cadre global** — refaire navigation, recherche, notifications, profil, bouton de thème et navigation mobile; conserver les destinations et actions actuelles.
3. **Composants communs** — harmoniser boutons, champs, filtres, onglets, badges, tableaux, cartes, menus, fenêtres, tiroirs utilitaires, notifications et états vide/chargement/erreur.
4. **Écrans métier** — appliquer la nouvelle hiérarchie au tableau de bord, CRM, réservations, opérations, finance, planning, catalogue, IA, Community Manager, rapports, paramètres, connexion et toutes les pages de détail.
5. **Adaptation** — traiter séparément grand écran, ordinateur, tablette et mobile; transformer les tableaux denses plutôt que les comprimer.
6. **Accessibilité** — corriger les libellés, noms accessibles, focus, contrastes, navigation clavier, zones tactiles, structure sémantique et réduction des animations.
7. **Validation** — parcourir toutes les routes en clair/sombre et aux largeurs 1280, 1024, 768, 480 et 360 px; tester les principaux formulaires, filtres, tris, menus, fenêtres, navigation, connexion et parcours métier.
8. **Polissage final** — deuxième passe visuelle et fonctionnelle pour corriger débordements, densité, alignements, états et éléments encore génériques.

## Contraintes techniques
- TanStack Start, Tailwind v4 et composants existants restent en place.
- Aucun remplacement des données ou intégrations fonctionnelles par des simulations nouvelles.
- Valeurs visuelles centralisées dans le système de thèmes; composants métier sans couleurs arbitraires.
- Animations de 160–240 ms, principalement `transform` et `opacity`, désactivables via `prefers-reduced-motion`.
- Aucun nouveau module métier, aucune suppression de route et aucune modification silencieuse des règles existantes.
