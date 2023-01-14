import 'bootstrap/dist/css/bootstrap.min.css';
//import $ from "jquery";
//import "bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

import { AppWindow, getStringValue } from "./app";

import { TaskTable } from './taskdeftable';
import { Metadata } from './metadata/metadata';
import { detachChildrenTask, saveTaskDef } from './taskdefsvc';
import { HtmlTableOptions, HtmlTablePaginationOptions } from './htmltable';

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


$(function() {

    let paginationOptions : HtmlTablePaginationOptions = { pageSize:5, nextPageId: "nextPage", previousPageId: "previousPage" };
    let options: HtmlTableOptions = { actions: true, filters: true  };
    taskTable = new TaskTable('#taskTableContainer', window.application, options, paginationOptions);

    taskTable.createTable();

    taskTable.setOnStartEdit(OnStartEdit.bind(this));
    taskTable.setOnStartNew(OnStartNew.bind(this));
    taskTable.setOnStartDelete(OnStartDelete.bind(this));
    taskTable.setOnStartSearch(OnStartSearch.bind(this));

    taskTable.loadList();



    $('#filter-classname').empty();
    $('#filter-classname').append("<option selected value=''>Class Name</option>");

    for(let className in window.application.metadata) {

        $('#filter-classname').append($('<option>', {
            value: className,
            text: window.application.metadata[className].className + " - " + window.application.metadata[className].description
        }));

    }
    

    $("#refreshBtn").on("click", function() {taskTable.loadList()});    

});




function buildTaskForm(className: string, propMetadata: any) {
    $(".task-prop-group").remove();
    $(".select-conn").hide();

    const classMetadata = window.application.metadata[className];
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
    window.application.currentParentId = taskTable.getNavigationCurrentId();
    window.application.navigateTo('taskdefedt/classname.html');
}

function OnStartEdit(event: JQuery.ClickEvent) {
    const taskId = getStringValue($(event.currentTarget).data("itemid")); 
    window.application.currentId = taskId;
    window.application.setFunctionEdit();
    window.application.navigateTo("taskdefedt/basic.html");
}

function OnStartDelete(event: JQuery.ClickEvent) {
    window.application.currentParentId = taskTable.getNavigationCurrentId();
    window.application.currentChildId = getStringValue($(event.currentTarget).data("itemid")); 
    detachChildrenTask(window.application).then(
        ()=> taskTable.loadList()
    )

}

function OnStartSearch(event: JQuery.ClickEvent) { 


    window.application.setFunctionAddChild();
    window.application.currentParentId = taskTable.getNavigationCurrentId();
    window.application.navigateTo("taskdefsubtask.html");
}

