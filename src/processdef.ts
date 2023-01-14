import 'bootstrap/dist/css/bootstrap.min.css';
//import $ from "jquery";
//import "bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Application, AppWindow } from './app';
import * as procdefsvc  from './procdefsvc';

declare let window : AppWindow;

function loadList() {

    $("#procTbl").find('tbody').empty();

    procdefsvc.getProcessDefList(window.application)
    .then(

        /* data-bs-toggle="modal" data-bs-target="#procDefMdl"  data-bs-entityId="EDIT:${data[i].processId}/${data[i].version}" */

        function(data){
            console.log(data);
            for(let i=0;i<data.length;i++)
                $("#procTbl").find('tbody').append(`<tr>`
                + `<th scope="row">`
                + `<a class="btn btn-primary start-edit" role="button" href='#' data-procdefid="${data[i].processId}/${data[i].version}"><i class="bi bi-pencil-square"></i></a>&nbsp;`
                + `<a class="btn btn-primary" role="button" href='#' data-bs-toggle="modal" data-bs-target="#procDefMdl"  data-bs-entityId="DELETE:${data[i].processId}/${data[i].version}"><i class="bi bi-trash-fill"></i></a>&nbsp;`
                + `<a class="btn btn-primary process-id" role="button" href='#' data-procdefid="${data[i].processId}/${data[i].version}"><i class="bi bi-play"></i></a>&nbsp;`
                + `<a class="btn btn-primary start-build" role="button" href='#' data-procdefid="${data[i].processId}/${data[i].version}"><i class="bi bi-code-square"></i></a>`
                + "</th>"
                + `<td>${data[i].name}</td><td>${data[i].description}</td><td>${data[i].taskDefinitionName?data[i].taskDefinitionName:""}</td><td>${data[i].taskDefinitionDescription?data[i].taskDefinitionDescription:""}</td>`
                + "</tr>");

            $(".process-id").on("click", run);
            $(".start-edit").on("click", 
                function startEdit() {
                    const procdefkey = $(this).data("procdefid").split("/");
                    procdefsvc.getProcessDef(window.application, procdefkey[0], procdefkey[1])
                    .then(
                        function(data) {
                            window.application.setFunctionEdit();
                            window.application.setApplicationData(data);

                            setTimeout(
                                function() { window.application.navigateTo("procdefedt/basic.html");},
                                1);
                        
            
                        }
                    )


                }
            );

            $(".start-build").on("click", 
                function startGenerate() {
                    const procdefkey = $(this).data("procdefid").split("/");
                    procdefsvc.generateProcess(window.application, procdefkey[0], procdefkey[1]);
                }
            );


        }
    );
}
// 




function run(event: JQuery.ClickEvent) {

    const procdefid = $(event.currentTarget).data("procdefid").split("/");

    
    procdefsvc.runProcess(window.application, procdefid[0], procdefid[1]);


}

let modal = $('#procDefMdl');

$('#procDefMdl').on('show.bs.modal', function (event:any) {


    let caption ="";
    let entityId = "";
    var button = event.relatedTarget;

    if(button != undefined) {

        var info = button.getAttribute('data-bs-entityId')

        const parts = info.split(":");
        
        switch(parts[0]) {
            case "EDIT":
                caption = "Edit";
                $("#proc-descr").removeAttr("disabled");
                break;
            case "DELETE":
                caption = "Delete";
                $("#proc-descr").attr("disabled","disabled");
                break;
        }

        $('#edit-mode').val(parts[0]);


        entityId = parts[1];
    }

    if(modal!=null && caption.length>0) {

        var modalTitle = modal.contents().find('.modal-title')
        //var modalBodyInput: any = exampleModal.querySelector('.modal-body input')

        if(modalTitle) modalTitle.text(caption + ' of Process Definition #' + entityId);
        //if(modalBodyInput) modalBodyInput.value = recipient
    }

    

    if(entityId.length>0) {

        const procdefkey = entityId.split("/");
        procdefsvc.getProcessDef(window.application, procdefkey[0], procdefkey[1])
        .then(
            function(data) {
                console.log(data);
                $("#proc-id").val(data.processId);
                $("#proc-version").val(data.version);
                $("#proc-name").val(data.name);
                $("#proc-descr").val(data.description);

            }
        )
    }


});

$('#procDefMdl').on('hide.bs.modal', 
    function (event:any) {
        console.log("hide.bs.modal ", event);
});

// ----- BUTTONS -----

$("#refreshBtn").on("click", loadList);

$("#newBtn").on("click", function() {
    //$("#procDefMdl").modal("toggle");
    window.application.setFunctionNew();
    setTimeout(
        function() { window.application.navigateTo("procdefedt/basic.html");},
        1);
});

$("#confirmBtn").on("click", function() {


    if($('#edit-mode').val()=="DELETE") {
        procdefsvc.deleteProcessDef(window.application,
            $("#proc-id").val(), $("#proc-version").val());
    } else if($('#edit-mode').val()=="EDIT") {
        procdefsvc.changeProcessDef(window.application
            , $("#proc-id").val(), $("#proc-version").val()
            , {'description': $("#proc-descr").val()});
    }

        $("#procDefMdl").modal("toggle");
});

    

$(function() {
    loadList();
});


