// Script de contenu pour l'extension Klassly Image Downloader
console.log('Extension Klassly Image Downloader chargée');

// Interface pour les messages envoyés au background script
interface DownloadMessage {
    action: 'download';
    url: string;
    filename: string;
}

// Types pour les notifications
type NotificationType = 'success' | 'error' | 'info';

// Fonction pour créer le bouton de téléchargement
function createDownloadButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.id = 'klassly-download-btn';
    button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Télécharger les images
    `;
    button.title = 'Télécharger toutes les images de la page';

    // Ajouter l'événement de clic
    button.addEventListener('click', handleDownloadClick);

    return button;
}

// Fonction pour gérer le clic sur le bouton
function handleDownloadClick(): void {
    console.log('Bouton de téléchargement cliqué');

    // Trouver toutes les images sur la page
    const images = document.querySelectorAll('img');
    let imageCount = 0;

    images.forEach((img: HTMLImageElement, index: number) => {
        // Vérifier que l'image a une source valide
        if (img.src && !img.src.startsWith('data:')) {
            imageCount++;
            sendDownloadMessage(img.src, `image_${index + 1}`);
        }
    });

    if (imageCount === 0) {
        alert('Aucune image trouvée sur cette page');
    } else {
        showNotification(`Téléchargement de ${imageCount} image(s) en cours...`, 'success');
    }
}

// Fonction pour télécharger une image
function sendDownloadMessage(url: string, filename: string): void {
    try {
        // Utiliser l'API Chrome pour télécharger
        const message: DownloadMessage = {
            action: 'download',
            url: url,
            filename: filename
        };

        chrome.runtime.sendMessage(message);
    } catch (error) {
        console.error('Erreur lors du téléchargement:', error);
        showNotification('Erreur lors du téléchargement', 'error');
    }
}

// Fonction pour afficher une notification
function showNotification(message: string, type: NotificationType = 'info'): void {
    // Supprimer toute notification existante
    const existingNotification = document.getElementById('klassly-notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Créer une notification temporaire
    const notification = document.createElement('div');
    notification.id = 'klassly-notification';
    notification.textContent = message;

    // Couleurs selon le type
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3'
    };

    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 12px 20px;
        border-radius: 4px;
        z-index: 10001;
        font-family: Arial, sans-serif;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        animation: slideInFromTop 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    // Supprimer la notification après 3 secondes
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Fonction pour injecter le bouton sur la page
function injectButton(): void {
    // Vérifier si le bouton existe déjà
    if (document.getElementById('klassly-download-btn')) {
        return;
    }

    // Créer le bouton
    const button = createDownloadButton();

    // Créer un conteneur pour le bouton
    const container = document.createElement('div');
    container.id = 'klassly-button-container';
    container.appendChild(button);

    // Ajouter le conteneur au body
    document.body.appendChild(container);
}

// Fonction pour vérifier si on doit afficher le bouton sur cette page
function shouldShowButton(): boolean {
    // Cibler spécifiquement le domaine klass.ly
    const allowedDomains = ['klass.ly'];
    return allowedDomains.some((domain: string) =>
        window.location.hostname.includes(domain)
    );
}

// Initialiser l'extension quand la page est chargée
function init(): void {
    if (shouldShowButton()) {
        // Attendre que le DOM soit complètement chargé
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', injectButton);
        } else {
            injectButton();
        }
    }
}

// Démarrer l'extension
init();
