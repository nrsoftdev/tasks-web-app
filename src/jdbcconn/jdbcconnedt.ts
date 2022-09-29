import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { AppWindow, getStringValue } from "../app";
import * as connsvc  from '../connsvc';
import { Toast } from 'bootstrap';
import { createResponseToast } from '../errormng';
import { JdbcConnData } from '../appdata';


declare let window : AppWindow;
let application = window.application;




$("#btnCancel").on("click", goBack);

$("#btnConfirm").on("click", function() {

    let jdbcConnData = window.application.getApplicationData() as JdbcConnData;

    if(application.isFunctionNew()) {
        jdbcConnData.connId = "0";
    }
    jdbcConnData.name = getStringValue($("#conn-name").val());
    jdbcConnData.description= getStringValue($("#conn-description").val());
    jdbcConnData.driver= getStringValue($("#conn-driver").val());
    jdbcConnData.url= getStringValue($("#conn-url").val());
    jdbcConnData.dbuser= getStringValue($("#conn-dbuser").val());
    jdbcConnData.password= getStringValue($("#conn-password").val());
    
    jdbcConnData.user= application.currentUser;

    if(application.isFunctionEdit()  || application.isFunctionDelete()) {
        jdbcConnData.connId = application.currentId;
    } 

    if(application.isFunctionEdit() || application.isFunctionNew()) {

        connsvc.changeJdbcConn(application, jdbcConnData)
        .then(goBack)
        .catch( function(xhr: JQuery.jqXHR<any>, status: JQuery.Ajax.ErrorTextStatus, message:String) {

            // console.log(xhr.responseJSON);

            $( ".toast-container" ).empty();

            $(".form-control").removeClass("is-invalid");
            $(".form-control").removeClass("is-valid");

            if(xhr.responseJSON)
                createResponseToast("#conn-", xhr.responseJSON?.responseDetails);

            $(".form-control").not("is-invalid").addClass("is-valid");

        });
    } else {
        connsvc.deleteJdbcConn(application, jdbcConnData ).then(goBack);
    }
    
});

$(function() {

    if(application.isFunctionEdit() || application.isFunctionDelete()) {

        const connId = application.currentId;
        if(Number(connId)>0) {


            connsvc.getJdbcConn(application, connId).then(

                function(data){
                        let jdbcConnData = new JdbcConnData(data);
                        $("#conn-name").val(jdbcConnData.name);
                        $("#conn-description").val(jdbcConnData.description);
                        $("#conn-driver").val(jdbcConnData.driver);
                        $("#conn-url").val(jdbcConnData.url);
                        $("#conn-dbuser").val(jdbcConnData.dbuser);
                        $("#conn-password").val(jdbcConnData.password);
                        $("#conn-password2").val(jdbcConnData.password);
                        window.application.setApplicationData(jdbcConnData);
                
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
        window.application.setApplicationData(new JdbcConnData());

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




