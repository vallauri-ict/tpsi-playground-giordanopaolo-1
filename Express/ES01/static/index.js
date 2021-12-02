$(document).ready(function() {

    $("#btnInvia").on("click", function() {
        let request = inviaRichiesta("get", "/api/servizio1", {"nome":"Aurora"});
        request.fail(errore);
        request.done(function(data) {
            alert(JSON.stringify(data));
        });
    });
    $("#btnInvia2").on("click", function() {
        let request = inviaRichiesta("patch", "/api/servizio1", {"nome":"Unico", "vampires":3});
        request.fail(errore);
        request.done(function(data) {
            if(data.modifiedCount > 0){
                alert("Aggiornamento eseguito correttamente");
            }
            else alert("Nessuna corrispondenza trovata")
        });
    });
});
