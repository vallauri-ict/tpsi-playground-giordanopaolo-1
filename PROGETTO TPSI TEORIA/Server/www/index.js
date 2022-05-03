"use strict"
$(document).ready(function() {

    let _btnInvia = $("#btnInvia");
    let _btnLogout = $("#btnLogout");

    /* **************************** AVVIO **************************** */
    let mailRQ = inviaRichiesta('GET', '/api/elencoPerizie/' + localStorage.getItem("_id"));
    mailRQ.done(function(data) {
        $(".container").css("visibility", "visible")
        visualizzaMail(data);
    });
    mailRQ.fail(errore)



    /* ********************** Visualizza Mail  *********************** */
    function visualizzaPerizie(data) {
        console.log(data);
    }


    /* ************************* Invio Mail  *********************** */
    _btnInvia.on("click", function() {
        let mail = {
            "to": $("#txtTo").val(),
            "subject": $("#txtSubject").val(),
            "message": $("#txtMessage").val()
        }
        let newMailRQ = inviaRichiesta('POST', '/api/newMail', mail);
        newMailRQ.done(function(data) {
            console.log(data);
            alert({"ris":"ok"});
        });
        newMailRQ.fail(errore)
    });


    /*  Per il logout è inutile inviare una richiesta al server.
		E' sufficiente cancellare il cookie o il token dal pc client
		Una richiesta al server semplificherebbe la cancellazione del cookie  
		
		_btnLogout.on("click", function() {
            let rq = inviaRichiesta('POST', '/api/logout');
            rq.done(function(data) {
                window.location.href = "login.html"
            });
            rq.fail(errore)
        });
    */

    _btnLogout.on("click", function() {
        localStorage.removeItem("token")
        localStorage.removeItem("_id")
        window.location.href = "login.html"
    });


});

