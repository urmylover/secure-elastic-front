window.onload = function(){

    var tabContainer = document.getElementById('tab');

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

            console.log(Data.d);

            //table
            
            var hot = new Handsontable(tabContainer, {
                title: "用户日志信息/分钟",
                data: Data.d,
                stretchH: 'all',
                //width: auto,
                autoWrapRow: true,
                height: 441,
                maxRows: 22,
                rowHeaders: true,
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
        },
        error: function(msg){
            console.log(msg);
        }
    })

    

}