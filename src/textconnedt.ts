import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { AppWindow } from "./app";
import * as connsvc  from './connsvc';
import { createErrorToast } from './errormng';



declare let window : AppWindow;
let application = window.application;




$("#btnCancel").on("click", goBack);

$("#btnConfirm").on("click", function() {

    const data = { 
        "connId": 0
        , "name": $("#conn-name").val()
        , "description": $("#conn-description").val()
        , "filename": $("#conn-filename").val()
        , "user": application.currentUser
    };

    if(application.isFunctionEdit()  || application.isFunctionDelete()) {
        data.connId = Number(application.sessionData.get("connId"));
    } 

    if(application.isFunctionEdit() || application.isFunctionNew()) {

        connsvc.changeTextConn(application, data.connId, data)
        .then(goBack)
        .catch( function(xhr: JQuery.jqXHR<any>, status: JQuery.Ajax.ErrorTextStatus, message:String) {

            // console.log(xhr.responseJSON);

            $( ".toast-container" ).empty();

            $(".form-control").removeClass("is-invalid");
            $(".form-control").removeClass("is-valid");

            if(xhr.responseJSON)
                createErrorToast("#conn-", xhr.responseJSON?.responseDetails);

            $(".form-control").not("is-invalid").addClass("is-valid");

        });
    } else {
        connsvc.deleteTextConn(application, data.connId ).then(goBack);
    }
    
})


$(function() {

    if(application.isFunctionEdit() || application.isFunctionDelete()) {

        const connId = application.sessionData.get("connId");
        if(connId>0) {
            let url = window.application.config.urlSvc + '/textconn/'+ connId;
            $.ajax(
                url,
                {
                    'method': 'GET',
                    'success': function(data){
                        console.log(data);
                        $("#conn-name").val(data.name);
                        $("#conn-description").val(data.description);
                        $("#conn-filename").val(data.filename);
                    }
            
                }
            );
        }
        if(application.isFunctionDelete())
            $(".form-control").attr("disabled","disabled");
        else if(application.isFunctionEdit())
            $(".form-control").removeAttr("disabled");

    } else {
        $("#conn-id").val("");
        $("#conn-name").val("");
        $("#conn-description").val("");
        $("#conn-filename").val("");
        $(".form-control").removeAttr("disabled");

    }
});

$("form").on('submit',function(e){
    e.preventDefault();
    e.stopPropagation();

    
    //$("form").addClass('was-validated');

});


function goBack() {
    setTimeout(
        function() { window.application.navigateTo("textconn.html");},
        1); 
    }




