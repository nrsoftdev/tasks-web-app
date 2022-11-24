import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { AppWindow, getStringValue } from "./app";
import * as connsvc  from './connsvc';
import { TextConnData } from './appdata';
import { setErrorState } from './errormng';



declare let window : AppWindow;
let application = window.application;




$("#btnCancel").on("click", goBack);

$("#btnConfirm").on("click", function() {

    let textConnData = window.application.getApplicationData() as TextConnData;

  
    textConnData.connId = "";
    textConnData.name = getStringValue($("#conn-name").val());
    textConnData.description = getStringValue($("#conn-description").val());
    textConnData.filename = getStringValue($("#conn-filename").val());
    textConnData.user = application.currentUser;


    if(application.isFunctionEdit()  || application.isFunctionDelete()) {
        textConnData.connId = application.currentId;
    } else if(application.isFunctionNew()) {
        textConnData.connId = "0";
    }

    if(application.isFunctionEdit() || application.isFunctionNew()) {

        connsvc.changeTextConn(application, textConnData)
        .then(goBack)
        .catch( function(xhr: JQuery.jqXHR<any>, status: JQuery.Ajax.ErrorTextStatus, message:String) {

            // console.log(xhr.responseJSON);

            $( ".toast-container" ).empty();

            $(".form-control").removeClass("is-invalid");
            $(".form-control").removeClass("is-valid");

            if(xhr.responseJSON)
                setErrorState("#conn-", xhr.responseJSON?.responseDetails);

            $(".form-control").not("is-invalid").addClass("is-valid");

        });
    } else {
        connsvc.deleteTextConn(application, textConnData ).then(goBack);
    }
    
})


$(function() {

    if(application.isFunctionEdit() || application.isFunctionDelete()) {

        const connId = application.currentId;
        if(Number(connId)>0) {
            let url = window.application.config.urlSvc + '/textconn/'+ connId;
            $.ajax(
                url,
                {
                    'method': 'GET',
                    'success': function(data){
                        let textConnData = new TextConnData(data);
                        //console.log(data);
                        $("#conn-name").val(data.name);
                        $("#conn-description").val(data.description);
                        $("#conn-filename").val(data.filename);

                        window.application.setApplicationData(textConnData);
                    }
            
                }
            );
        }
        if(application.isFunctionDelete())
            $(".form-control").attr("disabled","disabled");
        else if(application.isFunctionEdit())
            $(".form-control").removeAttr("disabled");

    } else {
        window.application.setApplicationData(new TextConnData());
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


