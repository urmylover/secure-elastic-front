# secure-elastic-front
secure-elastic-front
auditLog

usage: 
    
    npm install bower
  
    npm install
  
    bowerinstall
  
     node app
修改查询条数限制：
curl -XPUT -u elastic:changeme 'https://127.0.0.1:9200/auditlog/_settings' -k -d '{ "index" : { "max_result_window" : 5000000 } }'
