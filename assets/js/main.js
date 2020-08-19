

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
     * Quando il DOM si e' caricato la funzione 
     * imposta un setInterval() per modificare la temperatura del termometro,
     * il video e il colore della barra di navigazione.
    */

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

        // occorre cambiare video, cambia src del video
        if (changeVideo) {
            var video = document.getElementsByClassName("home-video")[0];

            if (nChanges == 0) {
                
                if (video.src.includes("/assets/video/fireplace.mp4")){
                    video.src = "/assets/video/river.mp4";
                }
                else{
                    video.src = "/assets/video/fireplace.mp4";
                }
                
            }

            nChanges++;
            changeVideo = false;
        }

    }, 3000);

});