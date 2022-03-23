"use strict"
// cordova plugin add cordova-plugin-dialogs
    
$(document).ready(function() {
  document.addEventListener('deviceready', function() {

    var watchID = null;
    let wrapper = $("#wrapper")[0] // js
    let results = $("#results")

    $("#btnAvvia").on("click", startWatch)
    $("#btnArresta").on("click", stopWatch);

    function startWatch() {
        results.html("");
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        watchID = navigator.accelerometer.watchAcceleration(success, error, options);
        if (watchID != null)
            notifica("Lettura Avviata");
    }

    function stopWatch() {
        if (watchID != null) {
            navigator.accelerometer.clearWatch(watchID);
            watchID = null;
            notifica("Lettura Arrestata");
        }
    }

	// .toLocaleTimeString('it-IT', { hour12: false }) funziona su ios ma
	// non su android. Su Internet dicono di usare moment()

    function success(acceleration) {
        var str = (new Date(acceleration.timestamp))
		    .toLocaleTimeString('it-IT', { hour12: false }) +
			"<br>" +
		    '&nbsp; X=' + acceleration.x.toFixed(3) +
            '&nbsp; Y=' + acceleration.y.toFixed(3) + 
            '&nbsp; Z=' + acceleration.z.toFixed(3);           
        results.html(str + "<hr/><br/>")
		console.log(acceleration.timestamp)
    }

    function error(err) {
        notifica("Errore: " + err.code + " - " + err.message);
    }

    function notifica(msg) {
        navigator.notification.alert(
            msg,
            function() {},
            "Info", // Titolo finestra
            "Ok"    // pulsante di chiusura
        );
    }
  })
});