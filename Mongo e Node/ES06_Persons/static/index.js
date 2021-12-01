"use strict"
$(document).ready(function() {
    let _lstNazioni = $("#lstNazioni");
    let _tabStudenti = $("#tabStudenti");
    let _divDettagli = $("#divDettagli");

    _divDettagli.hide();

    let request = inviaRichiesta("GET","/api/nazioni");
    request.fail(errore);
    request.done(function(data){
        console.log(data);
        for (const iterator of data.nazioni) {
            let a = $("<a>");
            _lstNazioni.append(a);
            console.log(iterator);
            a.text(iterator)
            a.addClass("dropdown-item");
            a.on("click", visualizzaPersone);

        }
    });
    function visualizzaPersone(){
        let nation = $(this).text();
        
        let request = inviaRichiesta("GET","/api/persone",{"nazione":nation})
        request.fail(errore);
        request.done(function(persons){
            _tabStudenti.empty();
            for (const person of persons) {
                let tr = $("<tr>").appendTo(_tabStudenti);
                for (const key in person) {
                    $("<td>").appendTo(tr).html(person[key]);
                }
                let td = $("<td>").appendTo(tr);
                $("<button>").appendTo(td).text("dettagli").on("click",dettagli).prop("name",person.name)
                td = $("<td>").appendTo(tr);
                $("<button>").appendTo(td).text("elimina").on("click",elimina).prop("name",person.name)
            }
        })
    }
    function dettagli(){
        let name = $(this).prop("name");
        let request = inviaRichiesta("PATCH","/api/dettagli",{"person":name})
        request.fail(errore);
        request.done(function(data){
            console.log(data);
            _divDettagli.show(1000);
            $(".card-img-top").prop('src',data.picture);
            $(".card-title").html(name);
            let g = "<b> gender:</b>" + data.gender + "<br>" + 
            "<b> address:</b>"
        
        })
    }
 
 
 
 
})
