import 'bootstrap/dist/css/bootstrap.min.css';
//import $ from "jquery";
import "bootstrap";
import { config } from "./CONFIG";

import 'bootstrap-icons/font/bootstrap-icons.css';

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


function loadList() {

    $("#textConnTbl").find('tbody').empty();

    let url = config.urlSvc + '/textconn';
    $.ajax(
        url,
        {
        'method': 'GET',
        'success': function(data){
            console.log(data);
            for(let i=0;i<data.length;i++)
                $("#textConnTbl").find('tbody').append(`<tr><th scope="row">`
                + `<a class="btn btn-primary" role="button" href='#' data-bs-toggle="modal" data-bs-target="#textConnMdl"  data-bs-connId="EDIT:${data[i].connId}"><i class="bi bi-pencil-square"></i></a>`
                + `<a class="btn btn-primary" role="button" href='#' data-bs-toggle="modal" data-bs-target="#textConnMdl"  data-bs-connId="DELETE:${data[i].connId}"><i class="bi bi-trash-fill"></i></a>`
                + `</th><td>${data[i].name}</td><td>${data[i].description?data[i].description:""}</td>`
                + `<td>${data[i].filename?data[i].filename:""}</td></tr>`);

        },
        'error':function(error) {
                    console.error(error);
                }
        }
    );
}
// 

let exampleModal = $('#textConnMdl');

    $('#textConnMdl').on('show.bs.modal', function (event:any) {
    
    
        let caption ="";
        let connId = "";
        var button = event.relatedTarget;

        if(button != undefined) {
    
            var connInfo = button.getAttribute('data-bs-connId')

            const parts = connInfo.split(":");
            
            switch(parts[0]) {
                case "EDIT":
                    caption = "Edit";
                    break;
                case "DELETE":
                    caption = "Delete";
                    break;
            }

            $('#edit-mode').val(parts[0]);
            connId = parts[1];
        }

        if(exampleModal!=null && caption.length>0) {
    
            var modalTitle = exampleModal.contents().find('.modal-title')
            //var modalBodyInput: any = exampleModal.querySelector('.modal-body input')
    
            if(modalTitle) modalTitle.text(caption + ' of Text Connector #' + connId);
            //if(modalBodyInput) modalBodyInput.value = recipient
        }

        if(connId.length>0) {
            let url = config.urlSvc + '/textconn/'+ connId;
            $.ajax(
                url,
                {
            
                'method': 'GET',
                'success': function(data){
                    console.log(data);
                    $("#conn-id").val(data.connId);
                    $("#conn-name").val(data.name);
                    $("#conn-descr").val(data.description);
                    $("#conn-file").val(data.filename);

            
                },
                'error':function() {
                            alert('errore!');
                        }
                }
            );
        }

    
    });

$("#confirmBtn").on("click", function() {

    const data = { 
        "connId": "0"
        , "name": $("#conn-name").val()
        , "description": $("#conn-descr").val()
        , "filename": $("#conn-file").val()
        , "changeUser": ""
        , "creationUser": ""
    };

    let connIdVal = $("#conn-id").val();
    let connId = "";
    if(connId == undefined) 
        connId = "0";
    else if(typeof connIdVal == "number" || typeof connIdVal == "string" ) {
        connId = String(connIdVal)
    } else if(typeof connIdVal?.length != "undefined" ) {
        connId = connIdVal[0];
    }

    let url = config.urlSvc + '/textconn';

    switch($("#edit-mode").val()) {
        case "NEW":
            data["creationUser"] = "ADMIN";
            $.post(
                url,
                data,
                function(data){
                    console.log(data);
                }
            );        
            break;
        case "EDIT":
            data["connId"] = connId;
            data["changeUser"] = "ADMIN";
            $.post(
                url,
                data,
                function(data){
                    console.log(data);
                }
            );        
            break;
        case "DELETE":
            url = url + "/" + connId;
            $.ajax({
                'url': url,
                'method': 'DELETE',
                'success': function(data){
                    console.log(data);
                },
                'error':function(err) {
                            console.log(err);
                        }
            });

            break;
    }
    $('#textConnMdl').modal('toggle');
    setTimeout(loadList,1);
})

$('#newBtn').on("click", function() {

    if(exampleModal!=null) {
    
        var modalTitle = exampleModal.contents().find('.modal-title')
        //var modalBodyInput: any = exampleModal.querySelector('.modal-body input')

        if(modalTitle) modalTitle.text('New Text Connector');
        //if(modalBodyInput) modalBodyInput.value = recipient

        $('#edit-mode').val("NEW");
        $('#textConnMdl').modal('toggle');
    }


});
    

$(function() {
    loadList();
})

$("#refreshBtn").on("click", loadList);


