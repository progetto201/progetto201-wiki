function setWrapperHeight() {
    /** 
     * Imposta altezza del wrapper con i container svg e video.
     * 
     * seleziona il wrapper e i video, controlla quale video e' visualizzato 
     * (non ha la classe "hidden"), calcola l'altezza con clientHeight
     * e imposta fino a un massimo di 1000px l'altezza del wrapper.
    */

    // seleziona elementi necessari
    var svgVideoWrapper = document.getElementById("svg-video-wrapper");
    var videos = document.getElementsByClassName("video");
    
    // recupera il video visualizzato
    var shownVideo = "";

    for (let i = 0; i < videos.length; i++) {
        const video = videos[i];
        if (video.classList != "video materialboxed hidden") {
            shownVideo = video;
            break;
        }

    }

    // trova l'altezza del video e impostala al wrapper
    var videoHeight = shownVideo.clientHeight;

    if (videoHeight < 1000) {
        svgVideoWrapper.style.gridTemplateRows = videoHeight + "px";
        shownVideo.style.height = "100%";
    } else {
        svgVideoWrapper.style.gridTemplateRows = 1000 + "px";
        shownVideo.style.height = svgVideoWrapper.style.gridTemplateRows;
    }

}


function changeBar(value, color) {
    /**
     * Imposta la barra del termometro con l'altezza <value> e con il colore <color>.
     * 
     * @param {string} value valore di altezza della barra del termometro
     * @param {string} color colore della barra del termometro
    */

    // questi 3 elementi hanno la possibilita' di essere modificati nello stesso modo
    // dalla funzione modValues()
    var list = ["#g5238", "#g4890", "#g4492"];


    function modValues(element, value, color) {
        /**
         * Modifica i path contenuti in <element>.
         * 
         * @param {string} element stringa con l'id dell'elemento con elementi da modificare
         * @param {string} value valore di altezza della barra del termometro
         * @param {string} color colore della barra del termometro
        */
        var bar = document.querySelector(element);
        var bar_els = bar.querySelectorAll("path");

        bar_els.forEach(smBar => {
            // modifica il colore
            smBar.style.fill = color;

            var dims = smBar.getAttribute("d").split(" ");
            dims[3] = value;
            
            smBar.setAttribute("d", dims.join(" "));
        });
    }


    // modifica l'altezza e il colore degli elementi contenuti negli elementi in <list>
    list.forEach(el => {
        modValues(el, value, color);
    });

    // nascondi l'elemento
    document.querySelector("#path4162").style.fillOpacity = "0";

    // modifica gli elementi in #g4890"
    var bar = document.querySelector("#g4890");
    var bar_els = bar.querySelectorAll("path");

    bar_els.forEach(smBar => {
        // modifica il colore
        smBar.style.fill = color;

        var dims = smBar.getAttribute("d").split(" ");
        dims[5] = value;
        
        smBar.setAttribute("d", dims.join(" "));
    });

    // modifica gli elementi in #g4492"
    var bar = document.querySelector("#g4492");
    var bar_els = bar.querySelectorAll("path");

    bar_els.forEach(smBar => {
        // modifica il colore
        smBar.style.fill = color;

        var dims = smBar.getAttribute("d").split(" ");

        var subdims = dims[1].split(",");
        subdims[1] = "0.00";

        dims[1] = subdims.join(",");

        smBar.setAttribute("d", dims.join(" "));
    });

    // modifica gli elementi in #g6502"
    var bar = document.querySelector("#g6502");
    var bar_els = bar.querySelectorAll("path");

    bar_els.forEach(smBar => {
        // modifica il colore
        smBar.style.fill = color;
    });

}


document.addEventListener('DOMContentLoaded', function () {
    /**
     * Quando il DOM si e' caricato inizializza gli elementi 
     * con classe materialboxed (immagini che possono essere ingrandite cliccandoci sopra),
     * imposta l'altezza del wrapper SVG e video e mantieni aggiornata l'altezza
     * quando viene ridimensionata la finestra.
     * Infine esegue una AJAX request per ottenere il contenuto del file SVG
     * con il termometro e imposta un setInterval() per modificare la temperatura del termometro,
     * il video e il colore della barra di navigazione.
    */
    
    // inizializza le immagini che possono essere ingrandite cliccandoci sopra
    var elems = document.querySelectorAll('.materialboxed');
    var instances = M.Materialbox.init(elems);

    // imposta altezza del wrapper
    setWrapperHeight();
    window.addEventListener("resize", setWrapperHeight);
    
    // inizializza oggetto per fare AJAX Request
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        /**
         * Funzione eseguita quando cambia lo stato della AJAX Request.
         * 
         * Se e' terminata e lo status code della richiesta e' 200
         * inserisce il contenuto della risposta nell'elemento #svg-container .
         * 
         * Ogni 3 secondi modifica l'altezza e il colore del liquido nel termometro,
         * il video e il colore della barra di navigazione.
        */
        if (xmlhttp.readyState == XMLHttpRequest.DONE) { // XMLHttpRequest.DONE == 4
            if (xmlhttp.status == 200) {

                // aggiungi la risposta all'elemento #svg-container
                var el_content = document.getElementById("svg-container").innerHTML;
                document.getElementById("svg-container").innerHTML = xmlhttp.responseText + el_content;

                // modifica altezza del liquido del termometro
                var i = 250; // altezza iniziale liquido

                var currColor = "blue";  // colore attuale
                var changeVideo = false; // true -> modifica il video
                var nChanges = 0;        // quante volte e' stato cambiato il video
                var navbar = document.getElementById("navbar"); // barra di navigazione

                var b = setInterval(function () {
                    /**
                     * Ogni 3 secondi cambia l'altezza del liquido
                     * del termometro, il suo colore, il video
                     * e il colore della barra di navigazione. 
                    */
                    if (i < 400) {
                        changeBar(i.toString() + ",00", "blue");
                        currColor = "blue";
                        i += 40;
                        nChanges = 0;
                        navbar.classList = "light-blue lighten-1";
                    } else if (i > 460) {
                        changeBar(i.toString() + ",00", "red");
                        currColor = "red";
                        i -= 40;
                        nChanges = 0;
                        navbar.classList = "";
                    } else {
                        if (currColor == "red") {
                            changeBar(i.toString() + ",00", "blue");
                            i -= 40;
                            changeVideo = true;
                            navbar.classList = "light-blue lighten-1";
                        } else {
                            changeBar(i.toString() + ",00", "red");
                            i += 40;
                            changeVideo = true;
                            navbar.classList = "";
                        }

                    }

                    // occorre cambiare video, nascondi il video mostrato e mostra il video nascosto
                    if (changeVideo) {
                        var videos = document.getElementsByClassName("video");

                        if (nChanges == 0) {
                            for (let i = 0; i < videos.length; i++) {
                                const video = videos[i];
                                if (video.classList == "video materialboxed hidden") {
                                    video.classList = "video materialboxed";

                                } else {
                                    video.classList = "video materialboxed hidden";
                                    
                                }

                            }
                        }

                        nChanges++;
                        changeVideo = false;

                    }

                }, 3000);

            } else if (xmlhttp.status == 400) {
                console.log('There was an error 400');
            } else {
                console.log('something else other than 200 was returned');
            }
        }
    };

    // imposta metodo e URL della richiesta e eseguila
    xmlhttp.open("GET", "/assets/svg/thermometer.svg", true);
    xmlhttp.send();

});