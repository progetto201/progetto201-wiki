document.addEventListener('DOMContentLoaded', function() {
    /**
     * Quando il DOM si e' caricato, inizializza i tooltip,
     * definisci la funzione per copiare del testo alla clipboard,
     * mostra gli elementi con classe "copy-link"
     * e aggiungi l'evento click per cambiare il suo colore
     * e per copiare alla clipboard l'URL specifico della sezione.
     * 
    */
    
    // inizializza i tooltip
    var elems = document.querySelectorAll('.tooltipped');
    var instances = M.Tooltip.init(elems);


    const copyToClipboard = str => {
        /** 
         * La funzione crea una textarea che
         * contiene la stringa <str> ed e' fuori schermo.
         * Poi seleziona la stringa contenuta nella textarea,
         * la copia e infine elimina la textarea.
         * 
         * @param {String} str stringa da copiare nella clipboard
        */
        
        // crea l'elemento textarea
        const el = document.createElement('textarea');
        // aggiungi <str> come testo
        el.value = str;
        // l'elemento e' in sola lettura
        el.setAttribute('readonly', '');
        // posizionalo fuori dalla pasina
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        // aggiungi al body l'elemento
        document.body.appendChild(el);
        // seleziona e copia il contenuto della textarea (<str>)
        el.select();
        document.execCommand('copy');
        // elimina l'elemento
        document.body.removeChild(el);
    };


    // seleziona tutti gli elementi con classe copy-link
    var copyLinks = document.getElementsByClassName("copy-link");
    var i = 0;
    // scorri gli elementi
    for (i = 0; i < copyLinks.length ; i++ ){
        // imposta classi dell'elemento per togliere "hidden"
        // > nota: i tooltip sono nascosti di default per non visualizzarli
        // > in caso di utente con JavaScript disattivato
        copyLinks[i].classList = "material-icons not-selectable copy-link";

        // aggiungi l'evento click
        copyLinks[i].addEventListener("click", function(ev){
            /**
             * Cambia lo sfondo del tooltip,
             * copia nella clipboard l'URL della sezione
             * e dopo 3 secondi torna al colore di sfondo originale
             * @param {Object} ev evento 
            */
            
            // memorizza il vecchio colore
            var oldColor = ev.target.M_Tooltip.tooltipEl.style.backgroundColor;
            // imposta il nuovo colore giallo/arancione
            ev.target.M_Tooltip.tooltipEl.style.backgroundColor = "#ffb74d";

            // salva nella clipboard l'URL della sezione:
            // - window.location.origin e' l'URL di tipo <IP o nome dominio>:<porta>
            // - window.location.pathname e' percorso del file (con la slash davanti)
            // - ev.target.parentElement.parentElement.id e' l'id del <h4> (che contiene un <a> che contiene l'elemento cliccato)
            copyToClipboard(window.location.origin + window.location.pathname + "#" + ev.target.parentElement.parentElement.id);
            
            // dopo 3 secondi imposta il vecchio colore di sfondo
            setTimeout(function(){
                ev.target.M_Tooltip.tooltipEl.style.backgroundColor = oldColor;
            }, 3000);
        });
    }

});