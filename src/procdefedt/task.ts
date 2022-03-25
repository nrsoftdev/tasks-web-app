//import $ from "jquery";
//import "bootstrap";
import { AppWindow, getStringValue } from '../app';

import 'bootstrap-icons/font/bootstrap-icons.css';
import { TaskTable, TaskTableOptions, TaskTablePaginationOptions } from '../taskdeftable';
import { getMetadata } from '../metadata/metadata';

declare let window : AppWindow;

$('#btnPrev').on('click',
function() {
    window.application.navigateTo('procdefedt/basic.html');
}
);

$('#btnNext').on('click',
function() {
    window.application.sessionData.set("taskId", $('input[name="taskSelect"]:checked').val());
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


$(".task-selection").on("keypress",
function(e) {
    if(e.key=="Enter") {

        let name : string = String($("#select-name").val());
        let desc : string = String($("#select-desc").val())

        if(name!=="") name = "%" + name + "%";
        if(desc!=="") desc = "%" + desc + "%";

        taskTable.loadListSearch( name , desc, getStringValue($("#select-class").val()));
    }

});


let classNameList = []

function saveMetadata(data:any):void {

    $('#select-class').empty();
    $('#select-class').append("<option selected value=''>Class Name</option>");


    for(let i=0;i<data.length;i++) {
        classNameList.push(data[i].className);
        $('#select-class').append($('<option>', {
            value: data[i].className,
            text: data[i].className + " - " + data[i].description
        }));

    }
}


let taskTable: TaskTable;

$(
    function() {
        if(window.application.isFunctionEdit())
            $("#currentTask").show();
        $("#proc-taskName").text(window.application.sessionData.get("proc-taskName"));
        $("#proc-taskDesc").text(window.application.sessionData.get("proc-taskDesc"));
        
        let paginationOptions : TaskTablePaginationOptions = { pageSize:10, nextPageId: "nextPage", previousPageId: "previousPage" };
        let options: TaskTableOptions = { 'paginationOptions': paginationOptions, selection: true, filters: true  };
        taskTable = new TaskTable('#taskTbl', window.application, options);
    
        taskTable.createTable();
    
        taskTable.loadList();

        getMetadata(window.application).then(saveMetadata);
    
    }
);