// verifica se il browser supporta le PWA
if ('serviceWorker' in navigator) {
    // registra il service worker
    navigator.serviceWorker.register('/sw.js')
    .then((reg) => {
        console.log("Service worker registered", reg);
    })
    .catch((err) => {
        console.log("Service worker not registered", err);
    })
}