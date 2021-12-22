$(document).ready(function() {

    let divIntestazione = $("#divIntestazione")
    let divCollections = $("#divCollections")
    let table = $("#mainTable")
    let divDettagli = $("#divDettagli")
    let currentCollection = "";
    let filters = $(".card").eq(0).hide();

    let request = inviaRichiesta("get", "api/getCollections");
    request.fail(errore)
    request.done(function(collections) {
      console.log(collections)
      let label = divCollections.children();
      for (const item of collections) {
        label.clone().appendTo(divCollections)
          .children("span").text(item.name)
          .siblings("input").val(item.name);
        $("<br>").appendTo(divCollections);
      }
      label.remove();
	  
    })

    divCollections.on("click", "input[type=radio]", function(){
      if(currentCollection != "unicorns") filters.show(); else filters.hide();

      currentCollection = $(this).val();
      table.children("tbody").empty();
      let request = inviaRichiesta("get", "/api/" + currentCollection)
      request.fail(errore);
      request.done(function(data){
        divIntestazione.find("strong").eq(0).text(currentCollection);
        divIntestazione.find("strong").eq(1).text(data.length);
        console.log(data)
        for (const item of data ) {
          let tr = $("<tr>");
          tr.appendTo(table.children("tbody"));
          let td= $("<td>");
          td.text(item._id);
          td.prop("id",item._id);
          
          td.on("click",visualizzaDettagli);
          td.appendTo(tr);
          td = $("<td>");
          td.text(item.name);
          td.prop("id",item._id);
          td.on("click",visualizzaDettagli);

          td.appendTo(tr);
          td = $("<td>");
          td.appendTo(tr);
          td.prop("id",item._id);
          let div = $("<div>");
          div.prop("id",item._id);
          div.appendTo(td);
          div.on("click", modifica)
          div = $("<div>");
          div.prop("id",item._id);
          div.on("click", sostituisci)
          div.appendTo(td);
          div = $("<div>");
          div.prop("id",item._id);
          div.on("click", elimina)
          div.appendTo(td);
          
        }
      })
    })

   
   function visualizzaDettagli(){
     console.log("ddddddddd")
     let request = inviaRichiesta("get", "/api/" + currentCollection + "/" + $(this).prop("id"))
     request.fail(errore);
     request.done(function(data){
        console.log(data);
        let content="";
        for (const key in data) {
          content+= "<strong>" + key + ": </strong>" + data[key] + "</br>"
        }
        divDettagli.html(content)
     })
   }
   $("#btnAdd").on("click", function(){
     divDettagli.empty();
     let txtA = $("<textarea>");
     txtA.val("{'name':''}");
     txtA.appendTo(divDettagli);

     let btnInvia = $("<button>");
     btnInvia.appendTo(divDettagli);
     btnInvia.text("Invia");
     btnInvia.on("click", function(){
       try {
         param = JSON.parse(txtA.val());
       } catch (error) { alert("Json formato non corretto")       }

       let id = ""
       let request = inviaRichiesta("post", "/api/" + currentCollection + "/" + id, param)
       request.fail(errore);
       request.done(function(){
        alert("Record aggiunto correttamente")
       })
     })

   })
   function sostituisci(){

   }

   function modifica(){


   }

   function elimina(){
     let request = inviaRichiesta("delete", "/api/" + currentCollection + "/" + $(this).prop("id"))
     request.fail(errore);
     request.done(function(data){
        console.log(data);
        alert("dato eliminato correttamente");
     })

   }
   
   
});