# Livrables du Projet "STEG Intervention Manager"

Ce document répertorie l'ensemble des éléments constituant le livrable final du projet de développement de la plateforme de gestion des interventions pour la STEG.

## 1. Code Source Complet

L'intégralité du code source de l'application, organisée et commentée.

-   **Framework Principal**: Next.js 15 (avec App Router)
-   **Langage**: TypeScript
-   **Style**: Tailwind CSS & ShadCN/UI
-   **Base de Données & Authentification**: Services Node.js interagissant avec Firebase (Firestore & Authentication) via le SDK Admin.
-   **Scripts**:
    -   `npm run dev`: Lance le serveur de développement.
    -   `npm run build`: Construit l'application pour la production.
    -   `npm run start`: Démarre un serveur de production.
    -   `npm run db:seed`: Peuple la base de données Firestore avec un jeu de données réaliste.

## 2. Documentation Technique

Ensemble des documents permettant la compréhension, la maintenance et l'évolution de l'application.

-   **`README.md`**: Instructions complètes pour l'installation, la configuration de l'environnement (y compris Firebase), et le lancement du projet en local.
-   **`SERVER_ARCHITECTURE.md`**: Description détaillée de l'architecture backend, de la modélisation des données dans Firestore et de l'interaction entre les Server Actions et la couche de services.
-   **`diagrams/`**: Répertoire contenant tous les diagrammes PlantUML pour une compréhension visuelle de l'architecture et des flux :
    -   `global_class_diagram.txt`: Vue d'ensemble des modèles de données et des services.
    -   `authentication_sequence_diagram.txt`: Flux de connexion d'un utilisateur.
    -   `intervention_management_sequence_diagram.txt`: Séquences pour la création et la mise à jour des interventions.
    -   Diagrammes de cas d'utilisation pour chaque rôle (Administrateur, Agent de support, Technicien).
    -   Et d'autres diagrammes de séquence (suppression, notification, etc.).

## 3. Artefacts de Gestion de Projet

Documents produits durant la phase de planification et de suivi du projet.

-   **`BACKLOG.tex`**: Product Backlog complet au format LaTeX, détaillant toutes les User Stories, priorisées selon la méthode MoSCoW et estimées en points.
-   **`SPRINT_1_BACKLOG.tex`, `SPRINT_2_BACKLOG.tex`, `SPRINT_3_BACKLOG.tex`**: Backlogs de sprint détaillés, découpant chaque User Story en tâches techniques avec des estimations en heures.
-   **`SPRINT_PLAN.tex`**: Plan de release global décrivant les objectifs, les fonctionnalités et la période de chaque sprint.
-   **`IDEAS.md`**: Liste des pistes d'améliorations et des évolutions futures possibles pour l'application.
-   **`PLAN.md`**: Plan de développement initial.

## 4. Documentation Utilisateur

-   **`RAPPORT.md`**: Un rapport de projet complet qui sert de guide fonctionnel. Il décrit les fonctionnalités clés de l'application, l'architecture technique de haut niveau, et comment démarrer avec le projet.

## 5. Application Fonctionnelle

L'application elle-même, déployable et prête à être utilisée, comprenant :

-   **Un portail public** pour le signalement d'interventions et la prise de contact.
-   **Un système d'authentification** sécurisé basé sur les rôles.
-   **Un tableau de bord complet** pour les employés, avec des interfaces adaptées à chaque rôle :
    -   Gestion CRUD des interventions.
    -   Gestion CRUD des utilisateurs (pour les administrateurs).
    -   Visualisation des statistiques et de l'historique.
    -   Un système de notifications en temps réel.
    -   Une recherche globale.
