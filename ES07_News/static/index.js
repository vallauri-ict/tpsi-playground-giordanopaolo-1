"use strict"
$(document).ready(function() {
    let wrapper = $("#wrapper");
    let news = $("#news");
    let _divDettagli = $("#divDettagli");

    _divDettagli.hide();

    let request = inviaRichiesta("GET","/api/elenco");
    request.fail(errore);
    /*<span class="titolo"> Titolo News</span>
		<a href = ’#’> Leggi </a>
		<span class='nVis'> visualizzato 1180 volte </span>
		<br>  */
    request.done(function(data){
            console.log(data)
        for (const item of data.notizie) {
            let span = $("<span>");
            span.addClass("titolo");
            span.text(item.titolo)
            wrapper.append(span);

            let a = $("<a>");
            span.text("Leggi");
            span.on("click",function(){
                let request2 = inviaRichiesta("POST","/api/dettagli",{notizia:item.file});
                request2.fail(errore);
                request2.done(function(data){
                    console.log(data);
                    news.text(data)
                    span2.text("visualizzato " + item.visualizzazioni + " Volte")
                })
            })
            wrapper.append(a);
            
            let span2 = $("<span>");
            span2.addClass("nVis");
            span2.text("visualizzato " + item.visualizzazioni + " Volte")
            wrapper.append(span2);

            let br = $("<br>");
            wrapper.append(br);

        }
    })




})