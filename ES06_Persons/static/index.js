"use strict"
$(document).ready(function() {
    let _lstNazioni = $("#lstNazioni");
    let _tabStudenti = $("#tabStudenti");
    let _divDettagli = $("#divDettagli");

    _divDettagli.hide()

    
    let request = inviaRichiesta("get", "/api/nazioni");
    request.fail(errore);
    request.done(function(nationList) {
        alert(JSON.stringify(nationList));
        console.log(nationList);
        
    });

 
 
 
 
})