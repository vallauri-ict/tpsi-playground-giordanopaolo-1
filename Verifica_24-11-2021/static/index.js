$(document).ready(function() {
    let select = $("#select")
    let request = inviaRichiesta("post", "/api/servizio1");
    request.done(function (data) {
        //console.log(data);
        for (const i of data) {
            let opt = $("<option>")
            opt.text(i._id)
            opt.val(i.value + "|" + i._id);
            opt.prop("id",i._id)
            select.append(opt);
        }
    });
    request.fail(errore);

    select.on("change", function(){
        //console.log($(this).prop("id"))
        $("#txt").text($(this).val().split("|")[0])
    })

    $("#save").on("click", function(){
        console.log($("#txt").val())
        let request = inviaRichiesta("post", "/api/servizio2", {id : $("#select").val().split("|")[1], txt:$("#txt").val()});
        request.done(function (data) {
            console.log(data);
        });
    })
});
