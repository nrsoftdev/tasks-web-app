//import $ from "jquery";
//import "bootstrap";
import { AppWindow, getStringValue } from '../app';

import 'bootstrap-icons/font/bootstrap-icons.css';
import { TaskTable } from '../taskdeftable';
import { Metadata } from '../metadata/metadata';
import { attachChildrenTask } from '../taskdefsvc';
import { ResponseDetail, TaskDefData } from '../appdata';
import { HtmlTableOptions, HtmlTablePaginationOptions } from '../htmltable';
import { showResponseToastMessage, showResponseToasts } from '../errormng';
import { decodeError } from '../resources/errormsg';

declare let window : AppWindow;


let classNameList = []

function saveMetadata(data:Metadata):void {

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
    window.application.currentChildId = taskTable.getCurrentSelectedId(); 
    attachChildrenTask(window.application)
    .then((result:ResponseDetail)=> {
        if(result) {
            showResponseToasts([result]);
        } else {
            showResponseToastMessage(decodeError("GEN00001"), "INFO");
            window.application.navigateTo('taskdef.html');
        }
    });
}

let taskTable: TaskTable;

$(
    function() {


        let paginationOptions : HtmlTablePaginationOptions = { pageSize:10, nextPageId: "nextPage", previousPageId: "previousPage" };
        let options: HtmlTableOptions = { actions: false, selection: true, filters: true  };
        taskTable = new TaskTable('#taskTableContainer', window.application, options, paginationOptions);
        taskTable.setOnStartConfirm(OnStartFinish);
        taskTable.setOnStartCancel(OnStartFinish);
    
        taskTable.createTable();
    
        taskTable.loadList();

        saveMetadata(window.application.metadata);
    
    }
);