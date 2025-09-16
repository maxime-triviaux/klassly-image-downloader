// Script de background pour l'extension Klassly Image Downloader

// Interface pour les messages reçus du content script
interface DownloadMessage {
    action: 'download';
    url: string;
    filename: string;
}

// Interface pour la réponse
interface DownloadResponse {
    success: boolean;
    error?: string;
}

// Type pour les raisons d'installation
type InstallReason = 'install' | 'update' | 'chrome_update' | 'shared_module_update';

// Extensions d'images supportées
const VALID_IMAGE_EXTENSIONS: readonly string[] = [
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'
] as const;

// Fonction pour extraire l'extension du fichier depuis l'URL
function getFileExtension(url: string): string {
    try {
        const pathname = new URL(url).pathname;
        const extension = pathname.split('.').pop()?.toLowerCase();

        if (extension && VALID_IMAGE_EXTENSIONS.includes(extension)) {
            return `.${extension}`;
        }

        // Par défaut, utiliser .jpg
        return '.jpg';
    } catch (error) {
        console.warn('Impossible de déterminer l\'extension du fichier:', error);
        return '.jpg';
    }
}

// Fonction pour télécharger une image
async function downloadImage(url: string, filename: string): Promise<void> {
    // Créer un nom de fichier unique avec timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = getFileExtension(url);
    const finalFilename = `klassly-images/${filename}_${timestamp}${extension}`;

    // Télécharger l'image
    const downloadId = await chrome.downloads.download({
        url: url,
        filename: finalFilename,
        conflictAction: 'uniquify'
    });

    console.log(`Image téléchargée avec l'ID: ${downloadId}, fichier: ${finalFilename}`);
}

// Écouter les messages du content script
chrome.runtime.onMessage.addListener(
    (
        request: DownloadMessage, 
        _sender: chrome.runtime.MessageSender, 
        sendResponse: (response: DownloadResponse) => void
    ): boolean => {
        if (request.action === 'download') {
            downloadImage(request.url, request.filename)
                .then(() => {
                    sendResponse({ success: true });
                })
                .catch((error: Error) => {
                    console.error('Erreur lors du téléchargement:', error);
                    sendResponse({
                        success: false,
                        error: error.message
                    });
                });

            // Retourner true pour indiquer que la réponse sera asynchrone
            return true;
        }

        return false;
    }
);

// Écouter l'installation de l'extension
chrome.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails) => {
    const reason = details.reason as InstallReason;

    switch (reason) {
        case 'install':
            console.log('Extension Klassly Image Downloader installée');
            break;
        case 'update':
            console.log('Extension Klassly Image Downloader mise à jour');
            break;
        default:
            console.log(`Extension mise à jour: ${reason}`);
    }
});

// Écouter les erreurs de téléchargement
chrome.downloads.onChanged.addListener((downloadDelta: chrome.downloads.DownloadDelta) => {
    if (downloadDelta.state?.current === 'complete') {
        console.log('Téléchargement terminé:', downloadDelta.id);
    } else if (downloadDelta.state?.current === 'interrupted') {
        console.error('Téléchargement interrompu:', downloadDelta.id);
    }
});