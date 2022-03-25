import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { AppWindow } from "./app";
import * as connsvc  from './connsvc';
import { Toast } from 'bootstrap';
import { createErrorToast } from './errormng';


declare let window : AppWindow;
let application = window.application;




$("#btnCancel").on("click", goBack);

$("#btnConfirm").on("click", function() {

    const data = { 
        "connId": 0
        , 'name': $("#conn-name").val()
        , 'description': $("#conn-description").val()
        , 'driver': $("#conn-driver").val()
        , 'url': $("#conn-url").val()
        , 'dbuser': $("#conn-dbuser").val()
        , 'password': $("#conn-password").val()
        , "user": application.currentUser
    };

    if(application.isFunctionEdit()  || application.isFunctionDelete()) {
        data.connId = Number(application.sessionData.get("connId"));
    } 

    if(application.isFunctionEdit() || application.isFunctionNew()) {

        connsvc.changeJdbcConn(application, data.connId, data)
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
        connsvc.deleteJdbcConn(application, data.connId ).then(goBack);
    }
    
});

$(function() {

    if(application.isFunctionEdit() || application.isFunctionDelete()) {

        const connId = application.sessionData.get("connId");
        if(connId>0) {


            connsvc.getJdbcConn(application, connId).then(

                function(data){
                        
                        $("#conn-name").val(data.name);
                        $("#conn-description").val(data.description);
                        $("#conn-driver").val(data.driver);
                        $("#conn-url").val(data.url);
                        $("#conn-dbuser").val(data.DBUser);
                        $("#conn-password").val(data.password);
                        $("#conn-password2").val(data.password);
                
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
        $("#conn-driver").val("");
        $("#conn-url").val("");
        $("#conn-dbuser").val("");
        $("#conn-password").val("");
        $("#conn-password2").val("");
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
        function() { window.application.navigateTo("jdbcconn.html");},
        1); 
    }




