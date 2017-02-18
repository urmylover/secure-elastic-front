var http = require('http');
var https = require('https');
var process = require('process');
var moment = require('moment');

var express = require('express');
var app = express();

app.use("/static", express.static(__dirname + '/public'));
app.use("/lib", express.static(__dirname + '/bower_components'));

//-------------------auditlog数据获取-----------------
//users: {}
var proceedData = {
	userNum: 0,
	auditNum: 0,
	tempData: [],
	user: [],
	auditCnts:[21,22,20,20,25,20,24,20,23,20,20,21,20,23,25],
	users: {}
};

/*var responseData = {
	user: {total:, data:[]}
}*/
var PORT = 9200;
var DATA = [];
var CONFIG = {
	currentSum: 0,
	firstApply: false,
	size: 0,//每页多少条数据
	from: 0//从哪页开始
}

function dataProcess(data){
	var length = data.length;
	if(CONFIG.firstApply){
		proceedData.auditNum += length;
		proceedData.tempData = [];
		proceedData.auditCnts.shift();
		proceedData.auditCnts.push(length);	
	}

	for(var i = 0; i < length; i++){
		var audit = data[i]._source;

		audit.audit_utc_timestamp = moment(audit.audit_utc_timestamp).format();
		audit.audit_date = moment(Date.parse(audit.audit_date)).format();

		proceedData.tempData.push(audit);

		var audit_request_user = audit.audit_request_user;

		//存入proceedData
		if(!proceedData.users['' + audit_request_user]){
			proceedData.userNum++;
			proceedData.user.push("" + audit_request_user);
			proceedData.users['' + audit_request_user] = {total:1, data:[audit]};
		}else{
			proceedData.users['' + audit_request_user].total++;
			//proceedData.users['' + audit_request_user].data.push(audit);
		}

	}

}

//10分钟更新一次数据
//首次请求

if(!CONFIG.firstApply){
	https.get({
			hostname: 'localhost',
			port: PORT,
			path: '/auditlog/auditlog/_search',
			auth: 'elastic:changeme',
			rejectUnauthorized:false,
			headers: {"content-type": "application/json"}
		}, function(res){
			
			console.log('statuscode ' + res.statusCode);

			res.on('data', function(data){

				var d = JSON.parse(data);

				//var total = d.hits.total;

				https.get({
						hostname: 'localhost',
						port: 19200,
						path: '/auditlog/auditlog/_search?size=10000',
						//path: '/auditlog/auditlog/_search?size=' + 30 + '&from=10',
						auth: 'elastic:changeme',
						rejectUnauthorized:false,
						/*headers: {
							"content-type": "application/json;charset=UTF-8",
							"content-encoding": "gzip"
						}*/
					}, function(res){

						console.log('statuscode ' + res.statusCode);

						var rawData = "";

						res.on('data', function(chunk){
							rawData += chunk;
						})

						res.on('end', function(){	
							//process.stdout.write(rawData);
							//process.stdout.write(rawData);
					
							//var d = JSON.parse(data);
							var d = JSON.parse(rawData);

							var total = d.hits.total;
							console.log('data length:' + total);
							
							//1. merge data to DATA
							//DATA = DATA.concat(d);

							//2. process d to processData
							
							dataProcess(d.hits.hits);
							console.log(proceedData.user);
							
							//console.log(proceedData.users);

							//更新currentSum值
							CONFIG.currentSum = total;
							console.log('total:' + total);
							CONFIG.firstApply = true;

						});

					}).on("error", function(data){
						console.log("error");
					});

			});

		});
};

var getAudit = function(){
	https.get({
			hostname: 'localhost',
			port: PORT,
			path: '/auditlog/auditlog/_search?size=30&from=' + CONFIG.currentSum,
			auth: 'elastic:changeme',
			rejectUnauthorized:false,
			headers: {"content-type": "application/json"}
		}, function(res){

			console.log('statuscode ' + res.statusCode);
			console.log('currentSum ' + CONFIG.currentSum);

			var rawData = "";

			res.on('data', function(chunk){
				rawData += chunk;
			});

			res.on('end', function(){	
				
					var d = JSON.parse(rawData);
					console.log(d);

					var total = d.hits.total;
					console.log('add data length:' + d.hits.hits.length);
					
					//1. merge data to DATA
					//DATA = DATA.concat(d);

					//2. process d to processData
					
					dataProcess(d.hits.hits);
					
					//console.log(proceedData.users);

					//更新currentSum值
					CONFIG.currentSum = total;
				
				});

			});
	};

//再次请求得到 新数据
setInterval(getAudit, 1000*60);

//--------------------auditlog 图表数据获取----------------

app.get('/auditlog', function(req, res){
	var Res = {labels: proceedData.user,data: []};
	Res.d = proceedData.tempData;
	Res.auditCnts = proceedData.auditCnts;
	var userNum = proceedData.userNum;

	for(var i = 0; i < userNum; i++){
		Res.data.push(proceedData.users[ "" + proceedData.user[i] ].total);
	}

	res.send(JSON.stringify(Res));
});

//--------------------auditlog 表格数据获取----------------

app.get('/auditlog/tabData', function(req, res){
	var Res = {labels: proceedData.user,data: []};
	Res.d = proceedData.tempData;
	Res.auditCnts = proceedData.auditCnts;
	var userNum = proceedData.userNum;

	for(var i = 0; i < userNum; i++){
		Res.data.push(proceedData.users[ "" + proceedData.user[i] ].total);
	}

	res.send(JSON.stringify(Res));
});

// 创建服务端
http.createServer(app).listen('5000', function() {
    console.log('启动服务器完成');
});

