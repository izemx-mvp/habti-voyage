# Mise à niveau fonctionnelle HABTI

## Objectif
Transformer l’application HABTI existante en plateforme opérationnelle plus complète, sans repartir de zéro, en gardant la direction premium verte, les modules utiles, la structure actuelle et l’interface 100% française.

## Navigation et structure
- Réorganiser le menu en groupes : Pilotage, Commercial, Expérience client, Marketing, Opérations, Finance, Analyse, Système.
- Supprimer le groupe “Intelligence”.
- Remplacer l’ancien “Service client” par “Agent Service Client”.
- Ajouter “Campagnes”, “Agent Community Manager” et “Paramètres du compte”.
- Renommer/aligner les entrées existantes : “Missions” devient “Opérations”, “Conseiller IA” reste “Conseiller Voyage & Activités”.

## Nouvelles pages complètes
- Créer une page de connexion premium avec logo HABTI, fond animé miroir, carte de connexion, validation, affichage/masquage du mot de passe, état de chargement et redirection vers le tableau de bord.
- Créer “Paramètres du compte” avec les onglets Profil, Sécurité, Notifications et Préférences.
- Créer “Campagnes” avec onglets WhatsApp, Email, Historique, liste, création en étapes, aperçu, génération IA démo et simulation d’envoi en mode démonstration.
- Créer “Agent Community Manager” avec onglets Idées, Planning et Paramètres de l’agent, cartes de publications, génération IA démo, calendrier éditorial, réglages par plateforme et états de connexion.
- Créer “Agent Service Client” avec Conversations, FAQ, Base de connaissances et Paramètres de l’agent, incluant prise de relais humain et suggestions IA.

## Pages de détail ERP
- Remplacer les expériences principales en tiroir par des pages complètes pour les entités importantes.
- Ajouter une page détail prospect avec fil d’Ariane, en-tête CRM, actions rapides et onglets : Vue d’ensemble, Analyse IA, Conversations, Suggestions, Devis, Réservations, Documents, Historique.
- Ajouter une page détail client avec onglets : Vue d’ensemble, Réservations, Activités, Voyages, Événements, Conversations, Devis, Paiements, Factures, Documents, Historique.
- Ajouter une page détail opération avec centre de commande, KPIs, planning, équipe, participants, logistique, documents, finance, analyse IA, historique, suggestions IA avec validation humaine et gestion de tâches.

## Données et interactions
- Étendre les données de démonstration françaises avec campagnes, publications sociales, FAQ, base de connaissances, opérations détaillées, tâches et préférences compte.
- Connecter les nouvelles actions à l’état local : créer, modifier, planifier, publier, générer avec l’IA, valider, annuler, prendre le relais, rendre à l’IA, approuver/refuser, assigner, marquer terminé.
- Garder un comportement démo explicite quand une intégration externe n’est pas configurée.
- Étendre la recherche globale pour couvrir prospects, clients, réservations, opérations, devis, factures, employés, campagnes et publications.

## Design et UX
- Conserver la palette HABTI verte et le fond animé miroir.
- Adapter l’ambiance du fond par section : tableau de bord, prospects, clients, marketing, campagnes, service client, planning, opérations et finance.
- Ajouter des micro-interactions cohérentes : cartes, lignes, boutons, onglets, calendriers, suggestions IA et tableaux.
- Mettre à jour le tableau de bord avec les nouveaux indicateurs : campagnes, publications, conversations, opérations à risque et activité récente.
- Améliorer les vues mobiles/tablettes sans compromettre la priorité bureau.

## Paramètres généraux
- Retirer toute “Configuration IA” générique du module Paramètres.
- Garder uniquement : informations entreprise, utilisateurs, rôles, permissions, notifications, règles métier, modèles de documents et préférences application.
- Déplacer les réglages IA dans les modules agents concernés.

## Logo
- Utiliser le composant logo existant comme point unique d’intégration.
- Vérifier les fichiers déjà disponibles dans le projet ; si le logo officiel n’est toujours pas présent, conserver le point d’intégration et signaler qu’il doit être renvoyé pour remplacement exact.

## Vérification
- Contrôler que l’interface reste entièrement en français.
- Tester les routes principales, actions visibles, onglets, formulaires, filtres, pages de détail, recherche globale, connexion, calendrier, génération IA démo et mode démonstration.
- Vérifier la compilation et les erreurs de prévisualisation avant de terminer.
