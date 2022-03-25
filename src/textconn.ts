import 'bootstrap/dist/css/bootstrap.min.css';
//import $ from "jquery";
// import "bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Application, AppWindow } from "./app";
import * as textconnsvc  from './connsvc';


declare let window : AppWindow;
let application = window.application;

function loadList() {

    $("#textConnTbl").find('tbody').empty();

    textconnsvc.getTextConnList(application).then(
        function(data){
            console.log("loading table...");
            for(let i=0;i<data.length;i++)
                $("#textConnTbl").find('tbody').append(`<tr><th scope="row">`
                + `<a class="btn btn-primary start-edit" role="button" href='#' data-connid="${data[i].connId}"><i class="bi bi-pencil-square"></i></a>&nbsp;`
                + `<a class="btn btn-primary start-delete" role="button" href='#' data-connid="${data[i].connId}"><i class="bi bi-trash-fill"></i></a>`
                + `</th><td>${data[i].name}</td><td>${data[i].description?data[i].description:""}</td>`
                + `<td>${data[i].filename?data[i].filename:""}</td></tr>`);

                $(".start-edit").on("click", 
                function startEdit() {
                    const connId = $(this).data("connid");
                    application.sessionData.clear();
                    application.sessionData.set("connId", connId);
                    application.setFunctionEdit();
                    
                    setTimeout(
                        function() { window.application.navigateTo("textconnedt.html");},
                        1);
                });
                
                $(".start-delete").on("click", 
                function startDelete(): void {
                    const connId = $(this).data("connid");
                    application.sessionData.clear();
                    application.setFunctionDelete();
                    application.sessionData.set("connId", connId);
                    setTimeout(
                        function() { window.application.navigateTo("textconnedt.html");},
                        1);
                });
                

        }
    );
}
// 





$('#newBtn').on("click", function() {
  
    application.sessionData.clear();
    application.setFunctionNew();
    
    setTimeout(
        function() { window.application.navigateTo("textconnedt.html");},
        1);

});

$(function() {

    loadList();
})

$("#refreshBtn").on("click", loadList);


