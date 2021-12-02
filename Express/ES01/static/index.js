$(document).ready(function() {

    $("#btnInvia").on("click", function() {
        let request = inviaRichiesta("get", "/api/servizio1", {"nome":"hhhhhhhhhh"});
        request.fail(errore);
        request.done(function(data) {
            if(data.length > 0) alert(JSON.stringify(data));
            else alert("Nessuna corrispondenza trovata")

        });
    });
    $("#btnInvia2").on("click", function() {
        let request = inviaRichiesta("patch", "/api/servizio2", {"nome":"Unico", "vampires":3});
        request.fail(errore);
        request.done(function(data) {
            if(data.modifiedCount > 0){
                alert("Aggiornamento eseguito correttamente");
            }
            else alert("Nessuna corrispondenza trovata")
        });
    });
    
    $("#btnInvia3").on("click", function() {
        let request = inviaRichiesta("get", "/api/servizio3/m/brown");
        request.fail(errore);
        request.done(function(data) {
            console.log(data);
        });
    });
});
