//import $ from "jquery";
//import "bootstrap";
import { AppWindow, getStringValue } from '../app';

import 'bootstrap-icons/font/bootstrap-icons.css';
import { TaskTable, TaskTableOptions, TaskTablePaginationOptions } from '../taskdeftable';
import { getMetadata } from '../metadata/metadata';
import { ProcessDefData } from '../appdata';

declare let window : AppWindow;

$('#btnPrev').on('click',
    function() {
        window.application.navigateTo('procdefedt/basic.html');
    }
);

$('#btnNext').on('click',
    function() {
        let processDefData = window.application.getApplicationData() as ProcessDefData;
        processDefData.taskDefinitionId =getStringValue( $('input[name="taskSelect"]:checked').val());
        window.application.navigateTo('procdefedt/var.html');
    }
);



$('#taskTbl').on('change', 'select', function (e) {
    let name : string = String($("#select-name").val());
    let desc : string = String($("#select-desc").val())

    if(name!=="") name = "%" + name + "%";
    if(desc!=="") desc = "%" + desc + "%";

    taskTable.loadListSearch( name , desc, getStringValue($("#select-class").val()));
});





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


let taskTable: TaskTable;

$(
    function() {
        if(window.application.isFunctionEdit()) {
            let processDefData = window.application.getApplicationData() as ProcessDefData;
            $("#currentTask").show();
            $("#proc-taskName").text(processDefData.taskDefinitionName);
            $("#proc-taskDesc").text(processDefData.taskDefinitionDescription);
        }

        let paginationOptions : TaskTablePaginationOptions = { pageSize:10, nextPageId: "nextPage", previousPageId: "previousPage" };
        let options: TaskTableOptions = { actions: false, filters: true  };
        taskTable = new TaskTable('#taskTableDiv', window.application, options, paginationOptions);
    
        taskTable.createTable();
    
        taskTable.loadList();

        getMetadata(window.application).then(saveMetadata);
    
    }
);