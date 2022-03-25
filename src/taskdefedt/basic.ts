import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Application, AppWindow, getStringValue } from '../app';
import { getTaskDef, getTaskDefList, TaskDefData } from '../taskdefsvc';
import { MetadataInfo } from '../metadata/metadata';
import { getJdbcConnList, getTextConnList } from '../connsvc';



declare let window : AppWindow;
let metadataInfo: MetadataInfo;

let taskDefData : TaskDefData = {
    name: '',
    description: '',
    user: '',
    properties: '',
    className: '',
    connectorName: ''
};

$('#btnPrevious').on('click',
function() {

    if(window.application.isFunctionNew())
        window.application.navigateTo('taskdefedt/classname.html');
    else {
        window.application.clearCurrentFunction();
        window.application.sessionData.clear();
        window.application.navigateTo('taskdef.html');
    }
}
);

$('#btnNext').on('click',
function() {
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
    if(connectorName.length>0)
        taskDefData.connectorName = connectorName;


    window.application.sessionData.set("taskDefData", taskDefData);
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
            const className = window.application.sessionData.get("className");
            $("#task-className").val(className);
            metadataInfo = window.application.metadata[className];
        } else if(window.application.isFunctionEdit()) {
            $("#task-name").prop("disabled",true);

            const taskId = window.application.sessionData.has("taskId")?String(window.application.sessionData.get("taskId")):"";
            if(taskId.length>0)
                getTaskDef(window.application, taskId)
                .then(
                    async function(data) {
                        const className = data.className;
                        metadataInfo = window.application.metadata[className];
                        window.application.sessionData.set("className", className);

                        window.application.sessionData.set("task-properties", data.properties);

                        $("#task-className").val(className);
                        $("#task-name").val(data.name);
                        $("#task-description").val(data.description);
                        $("#task-className").val(data.className);
                        if(metadataInfo.connectorType==="TEXT") {
                            await loadTextConnList();
                            $("#select-text-conn-group").show();
                        }
                        else if(metadataInfo.connectorType==="JDBC") {
                            await loadJdbcConnList();
                            $("#select-jdbc-conn-group").show();
                        }
                        
                    }
                )
        }

    }
);

async function loadTextConnList() {
    const data = await getTextConnList(window.application);
    $('#select-text-conn').empty();
    $('#select-text-conn').append("<option selected value='NONE'>Select a connector</option>");
    for (let i = 0; i < data.length; i++) {

        $('#select-text-conn').append($('<option>', {
            value: data[i].name,
            text: data[i].name + " - " + data[i].description + " (" + data[i].filename + ")"
        }));
    }
}

async function loadJdbcConnList() {
    const data = await getJdbcConnList(window.application);
    $('#select-jdbc-conn').empty();
    $('#select-jdbc-conn').append("<option selected value='NONE'>Select a connector</option>");
    for (let i = 0; i < data.length; i++) {

        $('#select-jdbc-conn').append($('<option>', {
            value: data[i].name,
            text: data[i].name + " - " + data[i].description + " (" + data[i].url + ")"
        }));
    }
}


