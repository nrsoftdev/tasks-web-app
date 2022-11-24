import 'bootstrap/dist/css/bootstrap.min.css';
//import $ from "jquery";
//import "bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Application, AppWindow } from "../app";
import * as connsvc  from '../connsvc';
import { JdbcConnData } from '../appdata';
import { setErrorState } from '../errormng';

/*
[
      {
      "connId": 1,
      "creationTime": "2021-09-28T09:58:05.458+02:00",
      "creationUser": "ADMIN",
      "description": "Prova",
      "filename": "c:/temp/pippo.txt",
      "name": "prova1"
   }
]

        <th scope="col">#</th>
        <th scope="col">Name</th>
        <th scope="col">Description</th>
        <th scope="col">Filename</th>


*/

declare let window : AppWindow;
let application : Application = window.application;



function loadList() {

    $("#jdbcConnTbl").find('tbody').empty();

    connsvc.getJdbcConnList(application).then(
        function(data){
            console.log(data);
            for(let i=0;i<data.length;i++)
                $("#jdbcConnTbl").find('tbody').append(`<tr><th scope="row">`
                + `<a class="btn btn-primary start-edit" role="button" href='#'  data-connid="${data[i].connId}"><i class="bi bi-pencil-square"></i></a>&nbsp;`
                + `<a class="btn btn-primary start-delete" role="button" href='#' data-connid="${data[i].connId}"><i class="bi bi-trash-fill"></i></a>&nbsp;`
                + `<a class="btn btn-primary start-check" role="button" href='#' data-connid="${data[i].connId}"><i class="bi bi-file-check"></i></a>`
                + `</th><td>${data[i].name}</td><td>${data[i].description?data[i].description:""}</td>`
                + `<td>${data[i].driver?data[i].driver:""}</td>`
                + `<td>${data[i].url?data[i].url:""}</td>`
                + `<td>${data[i].dbuser?data[i].dbuser:""}</td></tr>`
                );
            
            $(".start-edit").on("click", 
            function startEdit() {
                const connId = $(this).data("connid");
               
                application.currentId= connId;
                application.setFunctionEdit();
                
                setTimeout(
                    function() { window.application.navigateTo("jdbcconnedt.html");},
                    1);
            });
            
            $(".start-delete").on("click", 
            function startDelete(): void {
                const connId = $(this).data("connid");
                application.setFunctionDelete();
                application.currentId= connId;
                setTimeout(
                    function() { window.application.navigateTo("jdbcconnedt.html");},
                    1);
            });

            $(".start-check").on("click", 
            function startCheck(): void {
                const connId = $(this).data("connid");
                const data : JdbcConnData = application.getApplicationData() as JdbcConnData;
                connsvc.getJdbcConn(application, connId)
                .then(
                    function(data) {
                        return connsvc.checkJdbcConn(application, data);
                    }
                ).then(
                    function(responseData) {
                        if(responseData) {
                            setErrorState("", responseData.responseDetails )
                        }

                    }
                );
                
            });            

        }
    );
}
// 



$('#newBtn').on("click", function() {
    application.setApplicationData(new JdbcConnData());
    application.setFunctionNew();
    
    setTimeout(
        function() { window.application.navigateTo("jdbcconnedt.html");},
        1);


});
    

$(function() {
    loadList();
})

$("#refreshBtn").on("click", loadList);


