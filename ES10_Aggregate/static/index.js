"use strict"
$(document).ready(function() {
    let lstRegioni = $("#lstRegioni");
    let tbody = $("#tbody");

    let request = inviaRichiesta("GET","/api/elenco");
    request.fail(errore);
    request.done(function(data){
        console.log(data);
        for (const item of data.states) {
            let opt = $("<option>");
            opt.text(item.name + "[" + item.stationcount + "]");
            opt.appendTo(lstRegioni);
        }
    })
    lstRegioni.on("change", function(){
        console.log($(this).val());
        let str = $(this).val().substring(0, $(this).val().length-3)
        let request = inviaRichiesta("POST","/api/radios",{"regione":str});
        request.fail(errore);
        request.done(function(data){
            console.log(data.states);
            /*<thead id="thead">
                <th width="60" > </th>
                <th width="300"> nome </th>
                <th width="100"> codec </th>
                <th width="100"> bitrate </th>
                <th width="100"> votes </th>
                <th> </th>
		    </thead>*/
            creaTabella(data)
        })
    })
    function creaTabella(data){
        tbody.empty();
            for (const item of data.states) {

                let tr = $("<tr>");
                tbody.append(tr);

                let td = $("<td>");
                tr.append(td);

                let img = $("<img>");
                td.append(img)
                img.prop("src", item.favicon)
                img.css({"width":"40px"})

                td = $("<td>");
                tr.append(td);
                td.text(item.name);

                td = $("<td>");
                tr.append(td);
                td.text(item.codec);

                td = $("<td>");
                tr.append(td);
                td.text(item.bitrate);

                td = $("<td>");
                tr.append(td);
                td.text(item.votes);

                td = $("<td>");
                tr.append(td);

                img = $("<img>");
                td.append(img)
                img.prop("src", "like.jpg")
                img.css({"width":"40px"})
                img.prop("id", item.id)
                img.on("click",inviaLike)
            }
    }
    function inviaLike(){
        console.log($(this).prop("id"));
        let request2 = inviaRichiesta("POST","/api/like",{"id":$(this).prop("id")});
        request2.fail(errore);
        request2.done(function(data){
            lstRegioni.trigger("change")
        })
    }

})