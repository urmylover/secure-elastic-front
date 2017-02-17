window.onload = function(){
    var barChartCtx = document.getElementById("barChartCtx");
    var pieChartCtx = document.getElementById("pieChartCtx");
    var timeChartCtx = document.getElementById("timeChartCtx");
    var detailTab = document.getElementById("detailTab");

    //请求数据
    $.ajax({
        url: '/auditlog',
        xhrFields: {
            withCredentials: true
        },
        headers: {
            'Authorization': 'Basic ' + btoa('elastic:changeme')
        },
        success: function(data){
            var Data = JSON.parse(data);
            var labels = Data.user;

            console.log(Data);

            //---------time chart绘制--------
            var m = moment();
            var now = m.format("HH:mm:00");
            var mins = [];
            var auditCnts = [20];
            for(var i = 0; i < 15; i++){
                var min = m.add('minutes', -1).format("HH:mm:00");
                auditCnts.push(Math.ceil(25 * Math.random()));
                mins.push(min);
            }
            console.log(mins.length)
            mins = mins.reverse();
            auditCnts = auditCnts.reverse();

            var timeChart = new Chart(timeChartCtx, {
                type: 'bar',
                data: {
                    labels: mins,
                    datasets: [{
                        //label: ,
                        data: Data.auditCnts,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 122, 255, 0.2)',
                            'rgba(153, 142, 255, 0.2)',
                            'rgba(153, 152, 255, 0.2)',
                            'rgba(153, 162, 255, 0.2)',
                            'rgba(153, 132, 255, 0.2)',
                            'rgba(153, 12, 255, 0.2)',
                            'rgba(153, 22, 255, 0.2)',
                            'rgba(153, 202, 255, 0.2)',
                            'rgba(153, 212, 255, 0.2)',
                            'rgba(153, 222, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 122, 255, 0.2)',
                            'rgba(153, 142, 255, 0.2)',
                            'rgba(153, 152, 255, 0.2)',
                            'rgba(153, 162, 255, 0.2)',
                            'rgba(153, 132, 255, 0.2)',
                            'rgba(153, 12, 255, 0.2)',
                            'rgba(153, 22, 255, 0.2)',
                            'rgba(153, 202, 255, 0.2)',
                            'rgba(153, 212, 255, 0.2)',
                            'rgba(153, 222, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    legend: {
                        display: false
                    },
                    //responsive: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    },
                    label: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: "用户请求数/min"
                    },
                }
            });

            var barChart = new Chart(barChartCtx, {
                type: 'bar',
                data: {
                    labels: Data.labels,
                    datasets: [{
                        //label: '# of Votes',
                        data: Data.data,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    //responsive: false,
                    legend: {
                        display: false
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    },
                    /*title: {
                        display: true,
                        text: ""
                    },*/
                }
            });

            var pieChart = new Chart(pieChartCtx, {
                type: 'pie',
                data: {
                    labels: Data.labels,
                    datasets: [{
                        label: '# of Votes',
                        data: Data.data,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255,99,132,1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    //responsive: false,
                    /*title: {
                        display: true,
                        text: "用户请求数占比"
                    },*/
                }
            }); 

            //table
            var detailTabData = [Data.labels,Data.data];
            var tabContainer = document.getElementById('tab');
            var hot = new Handsontable(detailTab, {
                data: detailTabData,
                //stretchH: 'all',
                rowHeaders: [
                    "用户",
                    "counts"
                ],
                dropdownMenu: true
            });
        },
        error: function(msg){
            console.log(msg);
        }
    })

    

}