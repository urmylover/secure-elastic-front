window.onload = function(){
	var barChartCtx = document.getElementById("barChartCtx");
	var pieChartCtx = document.getElementById("pieChartCtx");
	var timeChartCtx = document.getElementById("timeChartCtx");

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
			    	responsive: false,
			        scales: {
			            yAxes: [{
			                ticks: {
			                    beginAtZero:true
			                }
			            }]
			        },
			        title: {
		        		display: true,
		        		text: "每分钟用户请求数"
			        },
			    }
			});

			var pieChart = new Chart(pieChartCtx, {
			    type: 'pie',
			    data: {
			        //labels: Data.labels,
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
			    	responsive: false,
			        title: {
		        		display: true,
		        		text: "用户请求数占比"
			        },
			    }
			});	

			//table
			var tabContainer = document.getElementById('tab');
			var hot = new Handsontable(tabContainer, {
				title: "用户日志信息/分钟",
				data: Data.d,
				rowHeaders: true,
				colHeaders: true,
				colHeaders: [
					"audit_date",
					"audit_remote_address",
					"audit_format_version",
					"audit_utc_timestamp",
					"audit_request_type",
					"audit_request_headers",
					"audit_principal",
					"audit_details",
					"audit_category",
					"audit_request_user",
					"audit_request_class",
					"audit_reason",
				],
				dropdownMenu: true
			});

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

			mins = mins.reverse();
			auditCnts = auditCnts.reverse();

			var timeChart = new Chart(timeChartCtx, {
			    type: 'bar',
			    data: {
			        labels: mins,
			        datasets: [{
			            label: '# of Votes',
			            data: Data.auditCnts,
			            /*backgroundColor: [
			                'rgba(255, 99, 132, 0.2)',
			                'rgba(54, 162, 235, 0.2)',
			                'rgba(255, 206, 86, 0.2)',
			                'rgba(75, 192, 192, 0.2)',
			                'rgba(153, 102, 255, 0.2)',
			                'rgba(255, 159, 64, 0.2)'
			            ],*/
			            /*borderColor: [
			                'rgba(255,99,132,1)',
			                'rgba(54, 162, 235, 1)',
			                'rgba(255, 206, 86, 1)',
			                'rgba(75, 192, 192, 1)',
			                'rgba(153, 102, 255, 1)',
			                'rgba(255, 159, 64, 1)'
			            ],*/
			            borderWidth: 1
			        }]
			    },
			    options: {
			    	responsive: false,
			        scales: {
			            yAxes: [{
			                ticks: {
			                    beginAtZero:true
			                }
			            }]
			        },
			        title: {
		        		display: true,
		        		text: "用户请求数"
			        },
			    }
			});

		},
		error: function(msg){
			console.log(msg);
		}
	})

	//[{name:,cnt:,data:[]}]

	var users = [];

	//根据用户分组

	//utc时间转化为正常时间

	

}