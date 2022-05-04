let myChart;
$(document).ready(function(){
    $(".dropdown-item").on("click", function(){
        let id = $(this).text().split(" ")[0]; //js
        let req = inviaRichiesta("get", "/api/getData", {sensor : id})
        req.fail(errore);
        req.done(function(data){
            console.log(data);
            let vetData = [];
            let vetDate = [];
            for (const item of data) {
                vetData.push(item.value);
                vetDate.push(item.timestamp)
            }
            //$(document.getElementById('myChart')).empty()
            if(myChart) myChart.destroy()
            const ctx = document.getElementById('myChart').getContext('2d');
            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: vetDate,
                    datasets: [{
                        label: '# of Votes',
                        data: vetData,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            });

        })
    })
})