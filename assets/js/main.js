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
            shownVideo = video
            break
        }

    }

    // trova l'altezza del video e impostala al wrapper
    var videoHeight = shownVideo.clientHeight;

    if (videoHeight < 1000) {
        svgVideoWrapper.style.gridTemplateRows = videoHeight + "px";
        shownVideo.style.height = "100%";
    } else {
        svgVideoWrapper.style.gridTemplateRows = 1000 + "px";
        shownVideo.style.height = svgVideoWrapper.style.gridTemplateRows
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
    var list = ["#g5238", "#g4890", "#g4492"]


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
            smBar.style.fill = color

            var dims = smBar.getAttribute("d").split(" ");
            dims[3] = value
            
            smBar.setAttribute("d", dims.join(" "))
        })
    }


    // modifica l'altezza e il colore degli elementi contenuti negli elementi in <list>
    list.forEach(el => {
        modValues(el, value, color)
    })

    // nascondi l'elemento
    document.querySelector("#path4162").style.fillOpacity = "0"

    // modifica gli elementi in #g4890"
    var bar = document.querySelector("#g4890");
    var bar_els = bar.querySelectorAll("path");

    bar_els.forEach(smBar => {
        // modifica il colore
        smBar.style.fill = color

        var dims = smBar.getAttribute("d").split(" ");
        dims[5] = value
        
        smBar.setAttribute("d", dims.join(" "))
    })

    // modifica gli elementi in #g4492"
    var bar = document.querySelector("#g4492");
    var bar_els = bar.querySelectorAll("path");

    bar_els.forEach(smBar => {
        // modifica il colore
        smBar.style.fill = color

        var dims = smBar.getAttribute("d").split(" ");

        var subdims = dims[1].split(",");
        subdims[1] = "0.00"

        dims[1] = subdims.join(",")

        smBar.setAttribute("d", dims.join(" "))
    })

    // modifica gli elementi in #g6502"
    var bar = document.querySelector("#g6502");
    var bar_els = bar.querySelectorAll("path");

    bar_els.forEach(smBar => {
        // modifica il colore
        smBar.style.fill = color
    })

}

document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.materialboxed');
    var instances = M.Materialbox.init(elems)

    setWrapperHeight()
    //window.addEventListener("resize", setWrapperHeight)
    
    Array.prototype.forEach.call(document.getElementsByClassName("video"), function (video) {
        video.addEventListener("resize", setWrapperHeight)
    
    });
    


    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) { // XMLHttpRequest.DONE == 4
            if (xmlhttp.status == 200) {

                document.getElementById("svg-container").innerHTML = xmlhttp.responseText;

                var i = 250

                var currColor = "blue"
                var changeVideo = false
                var nChanges = 0
                var navbar = document.getElementById("navbar");

                var b = setInterval(function () {

                    if (i < 400) {
                        changeBar(i.toString() + ",00", "blue")
                        currColor = "blue"
                        i += 40
                        nChanges = 0
                        navbar.classList = "light-blue lighten-1"
                    } else if (i > 460) {
                        changeBar(i.toString() + ",00", "red")
                        currColor = "red"
                        i -= 40
                        nChanges = 0
                        navbar.classList = ""
                    } else {
                        if (currColor == "red") {
                            changeBar(i.toString() + ",00", "blue")
                            i -= 40
                            changeVideo = true
                            navbar.classList = "light-blue lighten-1"
                        } else {
                            changeBar(i.toString() + ",00", "red")
                            i += 40
                            changeVideo = true
                            navbar.classList = ""
                        }

                    }

                    if (changeVideo) {
                        var shownVideo = "";
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

                        nChanges++
                        changeVideo = false;

                    }

                }, 3000)

            } else if (xmlhttp.status == 400) {
                console.log('There was an error 400');
            } else {
                console.log('something else other than 200 was returned');
            }
        }
    };

    xmlhttp.open("GET", "/assets/svg/thermometer.svg", true);
    xmlhttp.send();

});