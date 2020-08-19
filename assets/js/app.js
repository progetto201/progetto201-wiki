window.isUpdateAvailable = new Promise(function(resolve, reject) {
    // verifica se il browser supporta le PWA
    if ('serviceWorker' in navigator) {
        // registra il service worker
        navigator.serviceWorker.register('/sw.js')
        .then(reg => {
            /** Permetti di rilevare un nuovo aggiornamento per poi mostrare la notifica */
            reg.onupdatefound = () => {
                const installingWorker = reg.installing;
                installingWorker.onstatechange = () => {
                    switch (installingWorker.state) {
                        case 'installed':
                            if (navigator.serviceWorker.controller) {
                                // new update available
                                resolve(true);
                            } else {
                                // no update available
                                resolve(false);
                            }
                            break;
                    }
                };
            };
        })
        .catch(err => console.error('[SW ERROR]', err));
    }
});