# Intervention Manager

Intervention Manager est une application web moderne conçue pour numériser et optimiser la gestion des interventions techniques et administratives.

Cette plateforme centralise le cycle de vie complet d'une intervention, du signalement public à sa clôture par un technicien, en passant par l'assignation et le suivi par les agents de support.

## Stack Technique

-   **Framework**: [Next.js](https://nextjs.org/) (App Router, React Server Components)
-   **Langage**: [TypeScript](https://www.typescriptlang.org/)
-   **Base de Données**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
-   **Authentification**: [Firebase Authentication](https://firebase.google.com/docs/auth)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Composants UI**: [ShadCN/UI](https://ui.shadcn.com/)
-   **Validation de formulaires**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)

## Fonctionnalités Clés

-   **Portail Public**: Permet aux clients de signaler une intervention via un formulaire public.
-   **Tableau de Bord par Rôles**: Interface sécurisée et adaptée pour les Administrateurs, Agents de support et Techniciens.
-   **Gestion Complète (CRUD)**:
    -   **Interventions**: Créez, assignez, modifiez, suivez et supprimez des interventions.
    -   **Utilisateurs**: Gérez les comptes des employés (réservé aux administrateurs).
-   **Statistiques et Historique**: Visualisez les données clés avec des graphiques interactifs et accédez à l'archive complète des interventions.
-   **Notifications en Temps Réel**: Alertes pour les événements importants (nouvelle intervention, assignation, etc.).
-   **Recherche Globale**: Retrouvez rapidement n'importe quelle ressource (intervention, client, utilisateur) avec un raccourci `Cmd+K`.

---

## Démarrage Rapide

Suivez ces instructions pour installer et lancer le projet sur votre machine locale.

### 1. Prérequis

-   Node.js (v18 ou supérieure)
-   Un gestionnaire de paquets : `npm`, `yarn`, ou `pnpm`

### 2. Configuration de Firebase

Ce projet nécessite un projet Firebase pour la base de données et l'authentification.

1.  **Créer un projet Firebase**: Si vous n'en avez pas, créez un nouveau projet sur la [Console Firebase](https://console.firebase.google.com/).
2.  **Générer une clé de service**:
    -   Dans votre projet Firebase, allez dans **Paramètres du projet** > **Comptes de service**.
    -   Cliquez sur **Générer une nouvelle clé privée**. Un fichier JSON sera téléchargé.
    -   **Important**: Placez-le à la racine du projet. Le script de *seeding* est configuré pour utiliser ce nom de fichier spécifique.

### 3. Variables d'Environnement

1.  À la racine du projet, créez un fichier nommé `.env.local`.
2.  Ouvrez le fichier de clé JSON téléchargé à l'étape précédente et copiez les valeurs correspondantes dans votre fichier `.env.local` :

    ```env
    FIREBASE_PROJECT_ID="<your-project-id>"
    FIREBASE_CLIENT_EMAIL="<your-client-email>"
    FIREBASE_PRIVATE_KEY="<your-private-key>"
    ```

    > **Note pour `FIREBASE_PRIVATE_KEY`**: Copiez l'intégralité de la clé, en commençant par `-----BEGIN PRIVATE KEY-----` et en terminant par `-----END PRIVATE KEY-----\n`. Assurez-vous de remplacer les caractères de nouvelle ligne (`\n`) par leur équivalent littéral (`\\n`).

### 4. Installation des Dépendances

Ouvrez un terminal à la racine du projet et exécutez :

```bash
npm install
```

### 5. Peuplement de la Base de Données (Seeding)

Pour remplir votre base de données Firestore avec des données de test (utilisateurs et interventions), exécutez le script de seeding :

```bash
npm run db:seed
```

Cette commande n'est à exécuter qu'une seule fois. Le mot de passe par défaut pour tous les utilisateurs créés est `tunisie`.

### 6. Lancer le Serveur de Développement

Vous êtes prêt ! Lancez l'application avec :

```bash
npm run dev
```

L'application sera accessible à l'adresse [http://localhost:9002](http://localhost:9002).
