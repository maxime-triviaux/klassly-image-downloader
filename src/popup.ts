// Script pour le popup de l'extension Klassly Image Downloader

// Interface pour les messages de téléchargement
interface DownloadMessage {
    action: 'download';
    url: string;
    filename: string;
}

// Interface pour les éléments DOM
interface PopupElements {
    downloadBtn: HTMLButtonElement;
    status: HTMLDivElement;
}

// Fonction utilitaire pour obtenir les éléments DOM avec vérification de type
function getPopupElements(): PopupElements {
    const downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement;
    const status = document.getElementById('status') as HTMLDivElement;

    if (!downloadBtn || !status) {
        throw new Error('Éléments DOM requis non trouvés');
    }

    return { downloadBtn, status };
}

// Fonction pour vérifier si une URL est valide pour le téléchargement
function isValidWebUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
}

// Fonction pour vérifier si c'est une page système Chrome
function isChromeSystemPage(url: string): boolean {
    return url.startsWith('chrome://') || url.startsWith('chrome-extension://');
}

// Fonction à injecter dans la page pour déclencher le téléchargement
function triggerDownload(): void {

    function getFilenameFromUrl(url: string): string {
        const urlParts: string[] = url.split('/');
        const filename: string = urlParts[urlParts.length - 1];
        return filename || 'image';
    }
       
    const thumbs: NodeListOf<Element> = document.querySelectorAll('.kr-media-grid-item__img');
    thumbs.forEach((thumb: Element, index: number) => {
        const container: Element | null | undefined = thumb.parentElement?.parentElement;
        
        if (!container) {
            console.warn('Container non trouvé pour l\'élément thumb');
            return;
        }
        
        // Créer l'élément div au lieu de l'injecter en HTML
        const downloadButton: HTMLDivElement = document.createElement('div');
        downloadButton.className = 'kr-icon-button kr-icon-button__white kr-media-grid-item__tag-child';
        downloadButton.style.cssText = '--size: 32px; margin-top: 40px;';
        
        // Créer l'icône
        const icon: HTMLElement = document.createElement('i');
        icon.className = 'kr-icon icon icon-download';
        downloadButton.appendChild(icon);
        
        // Ajouter l'event listener avec neutralisation
        downloadButton.addEventListener('click', async function(event) {
            // Neutralise tous les autres events
            event.stopPropagation();
            event.preventDefault();
            event.stopImmediatePropagation();
            
            // Extraire l'URL de la background-image
            const bgImage = window.getComputedStyle(thumb).backgroundImage;
            
            // Extraire l'URL de "url(...)"
            const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
            
            if (urlMatch && urlMatch[1]) {
                let imageUrl = urlMatch[1];
                
                // Remplacer ".thumb" par une chaîne vide
                const cleanUrl = imageUrl.replace('.thumb', '');
                
                console.log('-- Maxime TEST');
                console.log('URL originale:', imageUrl);
                console.log('URL nettoyée:', cleanUrl);
    
                // Générer un nom de fichier
                const filename = getFilenameFromUrl(cleanUrl) || `image_${index + 1}`;
                
                console.log('🚀 Téléchargement en cours...', cleanUrl);

                // Envoyer au background script pour éviter les erreurs CORS
                chrome.runtime.sendMessage({ action: 'download', url: cleanUrl, filename: filename });
    
            } else {
                console.log('-- Maxime TEST - Aucune background-image trouvée');
            }
            
            return false;
        }, true); // true = capture phase (priorité maximale)
        
        // Ajouter le bouton au container
        container.appendChild(downloadButton);
    });
}

// Fonction pour mettre à jour l'état du bouton
function updateButtonState(
    button: HTMLButtonElement,
    status: HTMLDivElement,
    isLoading: boolean
): void {
    if (isLoading) {
        button.innerHTML = `<svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
            </svg>
            Scan en cours...`;
        button.disabled = true;
        status.innerHTML = 'Scan en cours...';
    } else {
        button.innerHTML = `<svg class="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
            </svg> Scanner la page`;
        button.disabled = false;
        status.innerHTML = 'Scan terminé !';
    }
}

// Fonction pour gérer le téléchargement
function handleDownload(elements: PopupElements): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        const tab = tabs[0];

        if (!tab || !tab.id || !tab.url) {
            elements.status.textContent = 'Impossible d\'accéder à l\'onglet actuel';
            return;
        }

        // Vérifier que c'est une page web valide
        if (isValidWebUrl(tab.url)) {
            // Exécuter le script de téléchargement
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: triggerDownload
            }).then(() => {
                updateButtonState(elements.downloadBtn, elements.status, true);

                // Réactiver le bouton après 3 secondes
                setTimeout(() => {
                    updateButtonState(elements.downloadBtn, elements.status, false);
                }, 1000);
            }).catch((error: Error) => {
                console.error('Erreur lors de l\'injection du script:', error);
                elements.status.textContent = 'Erreur lors du téléchargement';
                elements.downloadBtn.disabled = false;
            });
        } else {
            elements.status.textContent = 'Cette page ne supporte pas le téléchargement';
        }
    });
}


// Fonction pour vérifier et mettre à jour le statut initial
function checkInitialStatus(elements: PopupElements): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        const tab = tabs[0];

        if (!tab || !tab.url) {
            elements.status.textContent = 'Impossible d\'accéder à l\'onglet actuel';
            elements.downloadBtn.disabled = true;
            return;
        }

        if (isChromeSystemPage(tab.url)) {
            elements.status.textContent = 'Non disponible sur cette page';
            elements.downloadBtn.disabled = true;
        } else if (!isValidWebUrl(tab.url)) {
            elements.status.textContent = 'Page non supportée';
            elements.downloadBtn.disabled = true;
        }
    });
}

// Initialisation du popup
document.addEventListener('DOMContentLoaded', (): void => {
    try {
        const elements = getPopupElements();

        // Gérer le clic sur le bouton de téléchargement
        elements.downloadBtn.addEventListener('click', () => {
            handleDownload(elements);
        });

        // Vérifier le statut de la page actuelle
        checkInitialStatus(elements);

    } catch (error) {
        console.error('Erreur lors de l\'initialisation du popup:', error);
    }
});
