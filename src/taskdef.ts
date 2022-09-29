import 'bootstrap/dist/css/bootstrap.min.css';
//import $ from "jquery";
//import "bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

import { AppWindow, getStringValue } from "./app";

import { TaskTable, TaskTableOptions, TaskTablePaginationOptions } from './taskdeftable';
import { getClassMetadata, getMetadata, Metadata } from './metadata/metadata';
import { changeTaskDef, detachChildrenTask, saveTaskDef } from './taskdefsvc';

declare let window : AppWindow;

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


let textConnectors = [];
let jdbcConnectors = [];

let taskTable: TaskTable;
let currentPageNum=1;
let currentPages=1;


/*
let taskDefMdl = $('#taskDefMdl');
taskDefMdl.on('show.bs.modal', function (event:any) {

    let caption ="";
    let taskId = "";
    var button = event.relatedTarget;

    if(button != undefined) {

        var connInfo = button.getAttribute('data-bs-taskId')

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
        taskId = parts[1];
    }

    if(caption.length>0) {

        var modalTitle = taskDefMdl.contents().find('.modal-title')
        //var modalBodyInput: any = exampleModal.querySelector('.modal-body input')

        if(modalTitle) modalTitle.text(caption + ' of Task #' + taskId);
        //if(modalBodyInput) modalBodyInput.value = recipient
    }

    

    if(taskId.length>0) {

        $(".task-prop-group").remove();

        let url = window.application.config.urlSvc + '/task/'+ taskId;
        $.ajax(
            url,
            {
            'method': 'GET',
            'success': async function(data){
                console.log(data);

                const currentClassMetadata = await getClassMetadata( window.application, data.className);
                

                buildTaskForm(data.className, currentClassMetadata);

                $("#task-id").val(data.taskId);
                $("#task-name").val(data.name);
                $("#task-description").val(data.description);
                $("#task-className").val(data.className);

                // data.connectorName

                const classMetadata = metadata[data.className];
                if(classMetadata!==undefined) {
                    if(classMetadata.connectorType==="TEXT") {
                        $("#select-text-conn").find(`option[value="${data.connectorName}"]`).attr('selected','selected');
                    } else if(classMetadata.connectorType==="JDBC") {
                        $("#select-jdbc-conn").find(`option[value="${data.connectorName}"]`).attr('selected','selected');
                    }
                }

                for(let propertyName in data.properties) {

                    const propMetadata = currentClassMetadata[propertyName];
                    let property = data.properties[propertyName];
                    switch(propMetadata.propertyType) {
                        case "CHOICE":
                            $(`select[data-prop-name="${propertyName}"]`).find(`option[value="${property}"]`).attr('selected','selected');
                            break;
                        case "BOOLEAN":
                            $(`input[data-prop-name="${propertyName}"]`).prop("checked", Boolean(property));
                            break;
                        default:
                            $(`input[data-prop-name="${propertyName}"]`).val(property);
                    }

                }

            },
            'error':function(e) {
                        console.error(e);
                    }
            }
        );
    }    

});

*/




/*
Called when the user decide to create a new TaskDef
*/
/*
$("#confirmNewBtn").on("click"
, function() {

    // Selected class
    const className : string = String($('#select-class').val());


        if(className!=null && className.length>0) {
            $.get( 
                window.application.config.urlSvc + "/md/" + className
                , function(data) {

                    $("#task-className").val(className);

                    var modalTitle = taskDefMdl.contents().find('.modal-title')
                    //var modalBodyInput: any = exampleModal.querySelector('.modal-body input')
            
                    if(modalTitle) modalTitle.text("Definition of new task");
            
                    buildTaskForm(className, data);

                    $("#taskDefMdl").modal("toggle");
                }
            );
            } else {
                alert("Metadati non trovati per " + className);
            }

        $("#taskNewMdl").modal("toggle");
});

*/



let metadata : Metadata;

$(function() {

    let paginationOptions : TaskTablePaginationOptions = { pageSize:5, nextPageId: "nextPage", previousPageId: "previousPage" };
    let options: TaskTableOptions = { actions: true  };
    taskTable = new TaskTable('#taskTableContainer', window.application, options, paginationOptions);

    taskTable.createTable();

    taskTable.setOnStartEdit(OnStartEdit.bind(this));
    taskTable.setOnStartNew(OnStartNew.bind(this));
    taskTable.setOnStartDelete(OnStartDelete.bind(this));
    taskTable.setOnStartSearch(OnStartSearch.bind(this));

    taskTable.loadList();




    getMetadata(window.application).then(
        function(data) {
            metadata = data;
        }
    );
    

    $("#refreshBtn").on("click", function() {taskTable.loadList()});    

});




function buildTaskForm(className: string, propMetadata: any) {
    $(".task-prop-group").remove();
    $(".select-conn").hide();

    const classMetadata = metadata[className];
    if(classMetadata!==undefined) {
        if(classMetadata.connectorType==="TEXT") {
            $("#select-text-conn-group").show();
        } else if(classMetadata.connectorType==="JDBC") {
            $("#select-jdbc-conn-group").show();
        }
    }
}

function OnStartNew(event: JQuery.ClickEvent) {
    window.application.setFunctionNew();
    window.application.currentParentId = taskTable.getCurrentTaskId();
    window.application.navigateTo('taskdefedt/classname.html');
}

function OnStartEdit(event: JQuery.ClickEvent) {
    const taskId = getStringValue($(event.currentTarget).data("taskid")); 
    window.application.currentId = taskId;
    window.application.setFunctionEdit();
    window.application.navigateTo("taskdefedt/basic.html");
}

function OnStartDelete(event: JQuery.ClickEvent) {
    window.application.currentParentId = taskTable.getCurrentTaskId();
    window.application.currentChildId = getStringValue($(event.currentTarget).data("taskid")); 
    detachChildrenTask(window.application);

}

function OnStartSearch(event: JQuery.ClickEvent) { 


    window.application.setFunctionAddChild();
    window.application.currentParentId = taskTable.getCurrentTaskId();
    window.application.navigateTo("taskdefsubtask.html");
}

