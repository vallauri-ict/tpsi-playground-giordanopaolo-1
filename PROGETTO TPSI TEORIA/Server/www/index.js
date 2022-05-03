"use strict"
$(document).ready(function() {

    let _btnInvia = $("#btnInvia");
    let _btnLogout = $("#btnLogout");
    let divDettagli = $("#divDetails");
    divDettagli.css("visibility","hidden");
    let imgCard = $("#imgCard");
    $("#imgCard").remove();
    $("#creaUser").css("display", "none");
    $("#btncreateUser").on("click", function(){
        let newUser = {
            "name":$("#txtNewName").val(),
            "cognome":$("#txtNewSurname").val(),
            "username":$("#txtNewUser").val(),
            "dob":$("#txtNewDob").val(),
            "mail":$("#txtNewMail").val()
        };
        // invio l'utente a cui manca solo l'_id e la password
        let req = inviaRichiesta("POST", "/api/sendnewuser", newUser);
        req.done(function(data){
            alert("Utente Creato Correttamente");
        })
        req.fail(errore);
    })

    /* **************************** AVVIO **************************** */
    let position = new google.maps.LatLng(44.5557763, 7.7347183);	
    //#region options
    let mapOptions = {
        "center":position,
        "zoom":16, 
        "mapTypeId": google.maps.MapTypeId.ROADMAP
    }
    let mappa = new google.maps.Map(document.getElementById("mappa"), mapOptions); 



    /*
    

let infoWindow1 = new google.maps.InfoWindow({
	"content":
		`<div id="infoWindow">
			<h2> ITIS Vallauri
				<img src="img/vallauri.jpg" align="top">
			</h2>
			<p>indirizzo: Via San Michele 68, Fossano</p>
			<p>coordinate GPS: ${position.toString()} </p>
		</div>`,
	"width":"150px"
});

marcatore1.addListener("click", function(){
	infoWindow1.open(mappa, marcatore1);
})
    
    
    */
    let mailRQ;
    mailRQ = inviaRichiesta('GET', '/api/elencoPerizie/' + localStorage.getItem("_id"));
    if(localStorage.getItem("_id") == 0){
        $("#btnCrea").css("visibility", "visible");
        $("#btnCrea").on("click", function(){
            $(".container").eq(0).css("display", "none");
            $("#creaUser").css("display", "block");
        })
    }
    else $("#btnCrea").css("visibility", "hidden");

    mailRQ.done(function(data) {
        $(".container").css("visibility", "visible");
        visualizzaPerizie(data);
    });
    mailRQ.fail(errore)



    /* ********************** Visualizza Mail  *********************** */
    function visualizzaPerizie(data) {
        console.log(data);
        for (let perizia of data) {
            let tr = $('<tr>');
            $('<td>').text(perizia.Luogo).appendTo(tr);
            $('<td>').text(perizia.date).appendTo(tr);
            $('<td>').text(perizia.desc).appendTo(tr);
            $('#tabMail tbody').append(tr);
            tr.css("cursor","pointer");
            tr.val(perizia);
            tr.on("click", openPerizia);

            let position = new google.maps.LatLng(parseFloat(perizia.coodrdinateGeo.split(';')[0].replace(',', '.')), parseFloat(perizia.coodrdinateGeo.split(';')[1].replace(',', '.')));
            let marcatore = new google.maps.Marker({
                "map":mappa,
                "position":position,
                "title":perizia.Luogo,
                "animation":google.maps.Animation.DROP,
                "draggable":true,
                "zIndex" : 3
            });
            
            marcatore.addListener("click",function(){
                divDettagli.css("visibility","visible"); 
                console.log(perizia._id)
                $("#txtIdBelow").val(perizia._id);
                $("#txtPlace").val(perizia.Luogo);
                $("#txtCoordinate").val(perizia.coodrdinateGeo);
                $("#txtDate").val(perizia.date.substring(0, 10));
                $("#txtDescription").val(perizia.desc);
                divDettagli.find("div").remove();
                for (const photo of perizia.photos) 
                {
                    /// Scaricare le immagini da cloudinary
                    imgCard.find("input").val(photo.desc);
                    imgCard.clone().appendTo(divDettagli);
                }
            });
            
        }
    }

    function openPerizia()
    {
        console.log($(this).val());
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
    */

    _btnLogout.on("click", function() {
        localStorage.removeItem("token")
        localStorage.removeItem("_id")
        window.location.href = "login.html"
    });





});

