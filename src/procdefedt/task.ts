//import $ from "jquery";
//import "bootstrap";
import { AppWindow, getStringValue } from '../app';

import 'bootstrap-icons/font/bootstrap-icons.css';
import { TaskTable } from '../taskdeftable';
import { Metadata } from '../metadata/metadata';
import { ProcessDefData } from '../appdata';
import { HtmlTableOptions, HtmlTablePaginationOptions } from '../htmltable';

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


    //taskTable.loadListSearch( taskTable.getColumnFilters());
});





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


let taskTable: TaskTable;

$(
    function() {
        if(window.application.isFunctionEdit()) {
            let processDefData = window.application.getApplicationData() as ProcessDefData;
            $("#currentTask").show();
            $("#proc-taskName").text(processDefData.taskDefinitionName);
            $("#proc-taskDesc").text(processDefData.taskDefinitionDescription);
        }

        saveMetadata(window.application.metadata);

        let paginationOptions : HtmlTablePaginationOptions = { pageSize:10, nextPageId: "nextPage", previousPageId: "previousPage" };
        let options: HtmlTableOptions = { actions: false, selection:true, filters: true  };
        taskTable = new TaskTable('#taskTableDiv', window.application, options, paginationOptions);
    
        taskTable.createTable();
    
        taskTable.loadList();

        
    
    }
);