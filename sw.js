const staticCacheName = 'site-static-v2';
const dynamicCacheName = "site-dynamic-v2";

const assets = [
    // pagina principale
    "/",
    "/index.html",
    // pagina da visualizzare offline quando manca una cache
    "/fallback.html",
    // icona
    "/favicon.ico",
    "/assets/img/icons/icon-144x144.png",
    // font e icone
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://fonts.gstatic.com/s/materialicons/v54/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
    "https://fonts.gstatic.com/s/materialicons/v54/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
    // CSS e JS materialize, CSS comune a tutte le pagine
    "/assets/css/main.css",
    "/assets/js/materialize.min.js",
    // CSS della home
    "/assets/css/home.css",
    // JS della home
    "/assets/js/main.js",
    // video della home
    "/assets/video/fireplace.mp4",
    "/assets/video/river.mp4",
    "/assets/video/river_poster.jpg",
];

// ascolta installazione del service worker
self.addEventListener("install", (evt) => {
    /**
     * Si attiva quando il service worker viene modificato.
    */
    //console.log("Service worker has been installed");
    
    // aspetta la cache prima di finire l'installazione
    evt.waitUntil(
        // apri/crea la cache
        caches.open(staticCacheName)
        .then((cache) => {
            // ottieni le risorse e mettili nella cache
            cache.addAll(assets);
        })
    )
    
});

// ascolta attivazione del service worker
self.addEventListener("activate", (evt) => {
    /**
     * Si attiva quando l'utente chiude tutte le istanze e le riapre.
    */
    //console.log("Service worker has been activated");

    // cancella la vecchia cache
    evt.waitUntil(
        caches.keys().then( keys => {
            // cancella tutte le cache diverse dall'ultima (staticCacheName)
            return Promise.all(keys
                .filter(key => key !== staticCacheName && key !== dynamicCacheName)
                .map(key => caches.delete(key))
            )
        })
    )
});

// ascolta eventi fetch request
self.addEventListener("fetch", (evt) => {
    /**
     * Quando viene eseguita GET request. 
    */
    //console.log("fetch event", evt)

    // rispondi alla richiesta
    evt.respondWith(
        // cerca nella cache la risorsa
        caches.match(evt.request).then(cacheRes => {
            // se la cache contiene la risorsa restituiscila, 
            // altrimenti esegui la richiesta
            return cacheRes || fetch(evt.request).then(fetchRes => {
                // eseguiamo la cache della nuova richiesta
                return caches.open(dynamicCacheName).then(cache => {
                    // la chiave e' l'URL e il valore e' una copia della risorsa
                    cache.put(evt.request.url, fetchRes.clone());
                    // restituisci anche all'applicazione la risorsa
                    return fetchRes;
                })
            })
        })
        .catch(() => {
            // l'utente non ha mai richiesto questa risorsa ed e' offline...
            // e richiede una pagina html (non rispondiamo a richieste di immagini e video con html)
            if (evt.request.url.indexOf('.html') > -1){
                // visualizza all'utente che e' online
                return caches.match("/fallback.html");
            }
            
        })
        
    )
});