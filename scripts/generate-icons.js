#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Tailles d'icônes requises pour Chrome
const iconSizes = [16, 48, 128];

// Chemins
const svgPath = path.join(__dirname, '../icons/icon.svg');
const iconsDir = path.join(__dirname, '../icons');

console.log('🎨 Génération des icônes PNG à partir du SVG...');

// Vérifier que le fichier SVG existe
if (!fs.existsSync(svgPath)) {
    console.error('❌ Fichier SVG non trouvé:', svgPath);
    process.exit(1);
}

// Générer les icônes PNG
async function generateIcons() {
    try {
        const svgBuffer = fs.readFileSync(svgPath);
        
        for (const size of iconSizes) {
            const outputPath = path.join(iconsDir, `icon${size}.png`);
            
            await sharp(svgBuffer)
                .resize(size, size)
                .png()
                .toFile(outputPath);
            
            console.log(`✅ Icône générée: icon${size}.png (${size}x${size})`);
        }
        
        console.log('🎉 Toutes les icônes ont été générées avec succès !');
        
        // Mettre à jour le manifest pour utiliser les PNG
        updateManifest();
        
    } catch (error) {
        console.error('❌ Erreur lors de la génération des icônes:', error);
        process.exit(1);
    }
}

// Mettre à jour le manifest.json pour utiliser les PNG
function updateManifest() {
    const manifestPath = path.join(__dirname, '../manifest.json');
    
    try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        
        // Mettre à jour les icônes
        manifest.icons = {
            "16": "icons/icon16.png",
            "48": "icons/icon48.png",
            "128": "icons/icon128.png"
        };
        
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        console.log('📝 Manifest.json mis à jour avec les icônes PNG');
        
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour du manifest:', error);
    }
}

// Exécuter la génération
generateIcons();
