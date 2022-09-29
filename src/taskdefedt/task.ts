//import $ from "jquery";
//import "bootstrap";
import { AppWindow, getStringValue } from '../app';

import 'bootstrap-icons/font/bootstrap-icons.css';
import { TaskTable, TaskTableOptions, TaskTablePaginationOptions } from '../taskdeftable';
import { getMetadata } from '../metadata/metadata';
import { attachChildrenTask, getTaskDef, saveChildrenTask } from '../taskdefsvc';
import { TaskDefData } from '../appdata';

declare let window : AppWindow;


let classNameList = []

function saveMetadata(data:any):void {

    $('#select-class').empty();
    $('#select-class').append("<option selected value=''>Class Name</option>");

    classNameList = [];
    for(let className in data) {
        classNameList.push(className);
        $('#select-class').append($('<option>', {
            value: className,
            text: data[className].className + " - " + data[className].description
        }));

    }
}

function OnStartFinish(event: JQuery.ClickEvent) {
    console.log(event);
    window.application.currentChildId = taskTable.getCurrentSelectedTaskId();
    
    attachChildrenTask(window.application);
}


let taskTable: TaskTable;

$(
    function() {


        let paginationOptions : TaskTablePaginationOptions = { pageSize:10, nextPageId: "nextPage", previousPageId: "previousPage" };
        let options: TaskTableOptions = { actions: false, filters: true  };
        taskTable = new TaskTable('#taskTableContainer', window.application, options, paginationOptions);
        taskTable.setOnStartConfirm(OnStartFinish);
        taskTable.setOnStartCancel(OnStartFinish);
    
        taskTable.createTable();
    
        taskTable.loadList();

        getMetadata(window.application).then(saveMetadata);
    
    }
);