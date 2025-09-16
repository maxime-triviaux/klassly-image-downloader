# Klassly Image Downloader

Une extension Chrome simple et efficace pour télécharger toutes les images d'une page web en un seul clic.

## 🚀 Fonctionnalités

- **Téléchargement en un clic** : Bouton flottant sur toutes les pages web
- **Interface intuitive** : Popup accessible depuis la barre d'outils
- **Organisation automatique** : Images sauvegardées dans un dossier dédié
- **Support multi-formats** : JPG, PNG, GIF, WebP, SVG, BMP
- **Noms de fichiers uniques** : Évite les conflits avec horodatage
- **Design moderne** : Interface élégante avec animations
- **TypeScript** : Code robuste avec typage statique
- **Build simple** : Compilation TypeScript classique avec tsc

## 📦 Installation

> 🌐 **Guide visuel disponible** : Consultez notre [landing page](./index.html) pour un guide d'installation illustré et interactif !

### Installation en mode développeur (recommandé pour les tests)

1. **Téléchargez le projet** :
   ```bash
   git clone [URL_DU_REPO]
   cd klassly-image-downloader
   ```

2. **Installez les dépendances** :
   ```bash
   npm install
   ```

3. **Générez les icônes PNG** :
   ```bash
   npm run icons
   ```

4. **Compilez le projet TypeScript** :
   ```bash
   npm run build
   ```

5. **Ouvrez Chrome** et allez à `chrome://extensions/`

6. **Activez le mode développeur** (toggle en haut à droite)

7. **Cliquez sur "Charger l'extension non empaquetée"**

8. **Sélectionnez le dossier `dist`** (pas le dossier racine)

9. **L'extension est installée !** 🎉

### Vérification de l'installation

- Vous devriez voir l'icône de l'extension dans la barre d'outils
- Visitez n'importe quelle page web avec des images
- Un bouton "Télécharger les images" devrait apparaître en bas à droite

## 🎯 Utilisation

### Méthode 1 : Bouton flottant
1. Naviguez vers une page contenant des images
2. Cliquez sur le bouton violet "Télécharger les images" en bas à droite
3. Les images sont automatiquement téléchargées dans `Téléchargements/klassly-images/`

### Méthode 2 : Popup de l'extension
1. Cliquez sur l'icône de l'extension dans la barre d'outils
2. Cliquez sur "Télécharger maintenant"
3. Les images de la page active sont téléchargées

## 📁 Structure du projet

```
klassly-image-downloader/
├── src/                 # Code source TypeScript
│   ├── content.ts       # Script injecté dans les pages web
│   ├── background.ts    # Service worker pour les téléchargements
│   └── popup.ts         # Script du popup
├── dist/                # Fichiers compilés (générés automatiquement)
│   ├── content.js       # Script compilé
│   ├── background.js    # Service worker compilé
│   ├── popup.js         # Script popup compilé
│   ├── manifest.json    # Configuration (copiée)
│   ├── popup.html       # Interface (copiée)
│   ├── styles.css       # Styles (copiés)
│   └── icons/           # Icônes (copiées)
├── manifest.json        # Configuration de l'extension
├── popup.html           # Interface du popup
├── styles.css           # Styles pour le bouton flottant
├── icons/               # Icônes de l'extension
├── tsconfig.json        # Configuration TypeScript
├── package.json         # Dépendances et scripts
└── README.md            # Ce fichier
```

## 🔧 Personnalisation

### Cibler des sites spécifiques

Modifiez la fonction `shouldShowButton()` dans `content.js` :

```javascript
function shouldShowButton() {
    // Exemple : afficher seulement sur certains domaines
    const allowedDomains = ['example.com', 'images.google.com'];
    return allowedDomains.some(domain => window.location.hostname.includes(domain));
}
```

### Modifier l'apparence du bouton

Éditez le fichier `styles.css` pour personnaliser :
- Couleurs du bouton
- Position sur la page
- Animations
- Taille et forme

### Changer les critères de téléchargement

Dans `content.js`, modifiez la fonction `handleDownloadClick()` pour :
- Filtrer par taille d'image
- Exclure certains types de fichiers
- Ajouter des critères personnalisés

## 🛠️ Développement

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn
- Google Chrome ou Chromium
- Éditeur de code (VS Code recommandé)
- Connaissance de base en TypeScript

### Commandes de développement

```bash
# Installer les dépendances
npm install

# Compiler le projet TypeScript
npm run build

# Mode développement avec watch (recompile automatiquement)
npm run dev

# Mode watch seulement (sans copie des assets)
npm run build:watch

# Nettoyer le dossier dist
npm run clean

# Créer un package zip pour distribution
npm run package

# Générer les icônes PNG à partir du SVG
npm run icons

# Démarrer le serveur local pour la landing page
npm run serve
```

### Workflow de développement

1. **Mode développement** :
   ```bash
   npm run dev
   ```
   Lance la compilation initiale puis surveille les changements TypeScript.

2. **Compilation simple** :
   ```bash
   npm run build
   ```
   Compile le TypeScript et copie tous les assets.

3. **Rechargement de l'extension** :
   - Allez à `chrome://extensions/`
   - Cliquez sur le bouton de rechargement de l'extension
   - Ou utilisez Ctrl+R sur la page des extensions

4. **Débogage** :
   - **Background script** : `chrome://extensions/` → "Inspecter les vues : service worker"
   - **Content script** : F12 sur la page web → Console
   - **Popup** : Clic droit sur l'icône de l'extension → "Inspecter"
   - **TypeScript** : Les erreurs sont affichées directement par tsc

### Tests
- Testez sur le site klass.ly (configuré dans le code)
- Vérifiez les téléchargements dans le dossier de destination
- Testez les cas d'erreur (pages sans images, connexion lente)
- Vérifiez la compilation TypeScript avec `npm run build`

## 🚨 Limitations connues

- Ne fonctionne pas sur les pages `chrome://` ou `chrome-extension://`
- Certaines images peuvent être bloquées par CORS
- Les images en base64 ne sont pas téléchargées
- Nécessite l'autorisation de téléchargement de Chrome

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez que l'extension est activée
2. Rechargez l'extension depuis `chrome://extensions/`
3. Consultez la console de débogage
4. Ouvrez une issue sur GitHub

## 🎨 Crédits

- Icônes : Feather Icons
- Gradient : Inspiré de uiGradients
- Design : Principes Material Design

---

**Klassly Image Downloader** - Téléchargez vos images facilement ! 📸
