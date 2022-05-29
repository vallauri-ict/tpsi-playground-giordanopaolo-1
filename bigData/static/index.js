let myChart;
let intervall;
$(document).ready(function(){
    $(".dropdown-item").on("click", function(){
        let id = $(this).text().split(" ")[0]; //js
        clearInterval(intervall)
        intervall = setInterval(
            function(){
                let req = inviaRichiesta("get", "/api/getData200", {sensor : id})
                req.fail(errore);
                req.done(function(data){
                    console.log(data);
                    let vetData = [];
                    let vetDate = [];
                    let somma = 0;
                    let devizione=0;
                    for (const item of data) {
                        vetData.push(item.value);
                        vetDate.push(item.timestamp.substring(11, 19).replace("T"," "))
                        somma += item.value
                    }
                    for (let i = 0; i < 200; i++) {
                        devizione = (vetData[i] - (parseFloat(somma/200))) * (vetData[i] - (parseFloat(somma/200)))
                    }
                    devizione = parseFloat(devizione/200);
                    devizione = Math.sqrt(devizione);
                    $("#media").text("La media è:" + parseFloat(somma/200))
                    $("#deviazione").text("La deviazione standar è:" + devizione)
                    //$(document.getElementById('myChart')).empty()
                    if(myChart) myChart.destroy()
                    const ctx = document.getElementById('myChart').getContext('2d');
                    myChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: vetDate,
                            datasets: [{
                                data: vetData,
                                borderWidth: 2
                            }]
                        },
                        options: {
                            responsive:true,
                            scales: {
                                y: {
                                    beginAtZero: false
                                }
                            }
                        }
                    });

                })
            },5000
        )
        
    })
})