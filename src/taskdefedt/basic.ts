import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Application, AppWindow, getStringValue } from '../app';
import { getTaskDef, getTaskDefList } from '../taskdefsvc';
import { MetadataInfo } from '../metadata/metadata';
import { getJdbcConnList, getTextConnList } from '../connsvc';
import { TaskDefData } from '../appdata';



declare let window : AppWindow;
let metadataInfo: MetadataInfo;


$('#btnPrevious').on('click',
function() {

    if(window.application.isFunctionNew())
        window.application.navigateTo('taskdefedt/classname.html');
    else {
        window.application.clearCurrentFunction();
        window.application.clearApplicationData();
        window.application.navigateTo('taskdef.html');
    }
}
);

$('#btnNext').on('click',
function() {

    let taskDefData : TaskDefData = window.application.getApplicationData() as TaskDefData;

    taskDefData.name = getStringValue($("#task-name").val());
    taskDefData.description = getStringValue($("#task-description").val());
    taskDefData.className = getStringValue($("#task-className").val());
    let connectorName = "";
    if(metadataInfo.connectorType==="TEXT") {
        connectorName = getStringValue($("#select-text-conn").val());
    }
    else if(metadataInfo.connectorType==="JDBC") {
        connectorName = getStringValue($("#select-jdbc-conn").val());
    }
    if(connectorName=="NONE") connectorName="";
    //if(connectorName.length>0)
    taskDefData.connectorName = connectorName;


    //window.application.sessionData.set("taskDefData", taskDefData);
    window.application.navigateTo('taskdefedt/properties.html');
});

/*
task-name
task-description
task-className
select-text-conn-group
select-jdbc-conn-group
*/
$(
    function() {


        if(window.application.isFunctionNew()) {
            let taskDefData = window.application.getApplicationData() as TaskDefData;
            $("#task-className").val(taskDefData.className);
            metadataInfo = window.application.metadata[taskDefData.className];
        } else if(window.application.isFunctionEdit()) {

             
            $("#task-name").prop("disabled",true);


            if(window.application.currentId.length>0)
                getTaskDef(window.application, window.application.currentId)
                .then(
                    async function(data: TaskDefData) {
                        window.application.setApplicationData(data);
                   
                        const className = data.className;
                        metadataInfo = window.application.metadata[className];
                        //taskDefData.className=className;

                        //taskDefData.properties = data.properties;

                        $("#task-className").val(className);
                        $("#task-name").val(data.name);
                        $("#task-description").val(data.description);
                        $("#task-className").val(data.className);
                        if(metadataInfo.connectorType==="TEXT") {
                            await loadTextConnList(data.connectorName);
                            $("#select-text-conn-group").show();
                        }
                        else if(metadataInfo.connectorType==="JDBC") {
                            await loadJdbcConnList(data.connectorName);
                            $("#select-jdbc-conn-group").show();
                        }
                        
                    }
                )
        }

    }
);

async function loadTextConnList(connectorName:string) {
    const data = await getTextConnList(window.application);
    let initSelection = "";
    if(connectorName.length==0) initSelection = "SELECTED";
    $('#select-text-conn').empty();
    $('#select-text-conn').append("<option " + initSelection + " value='NONE'>Select a connector</option>");
    for (let i = 0; i < data.length; i++) {
        let selectedValue = "";

        if(data[i].name===connectorName)
            selectedValue = "selected";

        $('#select-text-conn').append($('<option>', {
            value: data[i].name,
            text: data[i].name + " - " + data[i].description + " (" + data[i].filename + ")",
            selected: selectedValue
        }));
    }
}

async function loadJdbcConnList(connectorName:string) {
    const data = await getJdbcConnList(window.application);
    let initSelection = "";
    if(connectorName.length==0) initSelection = "SELECTED";
    $('#select-jdbc-conn').empty();
    $('#select-jdbc-conn').append("<option " + initSelection + " value='NONE'>Select a connector</option>");
    for (let i = 0; i < data.length; i++) {
        let optionData = {
            value: data[i].name,
            text: data[i].name + " - " + data[i].description + " (" + data[i].url + ")",
            selected: ""
        };
        if(optionData.value===connectorName)
            optionData.selected = "selected";
        $('#select-jdbc-conn').append($('<option>', optionData ));
    }
}


