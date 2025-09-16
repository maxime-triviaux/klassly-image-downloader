# Icônes pour l'extension

## Génération automatique des icônes PNG

Les icônes PNG sont générées automatiquement à partir du fichier SVG avec la commande :

```bash
npm run icons
```

## Génération manuelle des icônes PNG

Si vous préférez générer manuellement les icônes, vous pouvez utiliser les commandes suivantes :

### Avec Inkscape (recommandé)
```bash
# Installer Inkscape si nécessaire
# Sur macOS : brew install inkscape
# Sur Ubuntu : sudo apt-get install inkscape

# Générer les icônes
inkscape icon.svg --export-png=icon16.png --export-width=16 --export-height=16
inkscape icon.svg --export-png=icon48.png --export-width=48 --export-height=48
inkscape icon.svg --export-png=icon128.png --export-width=128 --export-height=128
```

### Avec ImageMagick (alternative)
```bash
# Installer ImageMagick si nécessaire
# Sur macOS : brew install imagemagick
# Sur Ubuntu : sudo apt-get install imagemagick

# Générer les icônes
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

### En ligne (plus simple)
Vous pouvez aussi utiliser des convertisseurs en ligne comme :
- https://convertio.co/svg-png/
- https://cloudconvert.com/svg-to-png

## Tailles requises
- **16x16** : Icône dans la barre d'outils
- **48x48** : Icône dans la page des extensions
- **128x128** : Icône dans le Chrome Web Store
