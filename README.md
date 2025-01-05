
# DicteeApp

**DicteeApp** est une application React conçue pour aider les enfants à apprendre leurs mots de dictée. Les utilisateurs peuvent créer des listes de mots, les écouter, et écrire les mots entendus avec la bonne orthographe pour s'entraîner.

## Prérequis

Avant de commencer, vous devez installer [Node.js](https://nodejs.org/). Node.js est une plateforme qui permet d'exécuter JavaScript côté serveur, et elle est nécessaire pour faire fonctionner cette application.

### Installation de Node.js

1. Accédez au site officiel de [Node.js](https://nodejs.org/).
2. Téléchargez la version **LTS** (recommandée pour la plupart des utilisateurs).
3. Suivez les instructions d'installation pour votre système d'exploitation :
   - **Windows** : Double-cliquez sur le fichier téléchargé et suivez les étapes de l’assistant d’installation.
   - **macOS** : Double-cliquez sur le fichier .pkg téléchargé et suivez les étapes.
   - **Linux** : Utilisez un gestionnaire de paquets, comme `apt` ou `yum`, pour installer Node.js.

   Exemple pour Debian/Ubuntu :
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm
   ```

4. Une fois installé, vérifiez que Node.js et npm (Node Package Manager) sont bien installés en exécutant :
   ```bash
   node -v
   npm -v
   ```

## Installation de l'application

1. Clonez le dépôt ou téléchargez les fichiers :
   ```bash
   git clone https://github.com/votre-utilisateur/dictee-app.git
   cd dictee-app
   ```

2. Installez les dépendances avec npm :
   ```bash
   npm install
   ```

## Scripts disponibles

Voici les scripts définis dans le fichier `package.json` et leur utilisation :

- **Démarrage en mode développement :**
  ```bash
  npm run dev
  ```
  Ce script lance l'application en mode développement. Elle est accessible à l'adresse `http://localhost:5173`.

- **Construction pour la production :**
  ```bash
  npm run build
  ```
  Ce script compile l'application en vue d'une mise en production.

- **Aperçu d'une version construite :**
  ```bash
  npm run preview
  ```
  Ce script prévisualise une version construite de l'application.

- **Analyse du code avec ESLint :**
  ```bash
  npm run lint
  ```
  Ce script vérifie la qualité et la conformité du code.

## Utilisation

1. Lancez le mode développement avec :
   ```bash
   npm run dev
   ```

2. Ouvrez votre navigateur et accédez à l'URL affichée dans le terminal (généralement `http://localhost:5173`).

3. **Fonctionnalités :**
   - Créez une liste de mots pour la dictée.
   - Écoutez les mots lus par l'application.
   - Écrivez les mots pour vérifier leur orthographe.

4. Pour revenir au menu principal, cliquez sur le bouton approprié dans l'application.

## Technologies utilisées

- **React** : Bibliothèque JavaScript pour construire l'interface utilisateur.
- **Vite** : Outil de développement rapide pour les applications modernes.
- **TailwindCSS** : Framework CSS pour le design.
- **Framer Motion** : Animation des composants React.
- **Shadcn UI** : Utilisaton des composants shadcn.ui (`https://ui.shadcn.com/docs/components/badge`)

## Contribution

Les contributions sont les bienvenues ! Si vous souhaitez ajouter des fonctionnalités ou corriger des bugs, veuillez soumettre une pull request.

---
