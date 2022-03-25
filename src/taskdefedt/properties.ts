import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Application, AppWindow, getStringValue } from '../app';
import { ClassMetadata, getClassMetadata } from '../metadata/metadata';
import { changeTaskDef, deleteTaskDef, saveChildrenTask, saveTaskDef, TaskDefData } from '../taskdefsvc';



declare let window : AppWindow;

$('#btnPrevious').on('click',
function() {
    window.application.navigateTo('taskdefedt/basic.html');
}
);

$('#btnConfirm').on('click',
function() {

    let properties: {[k: string]: string} = {};

    $(".task-prop").each(
        function (this: HTMLElement, index: number, element: HTMLElement) : false | void {
            properties[ String($(element).data("prop-name")) ] = getStringValue($(element).val());
        }
    );

    const taskDefData : TaskDefData = window.application.sessionData.get("taskDefData");
    const parentTaskId = window.application.sessionData.get("parentTaskId");

    let taskId = "";
    if(window.application.sessionData.has("taskId"))
        taskId = window.application.sessionData.get("taskId");

    if(window.application.isFunctionNew()) {

        if(parentTaskId) {
            saveChildrenTask(window.application, parentTaskId, taskDefData, properties);
        } else {
            saveTaskDef(window.application, taskDefData, properties);
        }
    }
    else if(window.application.isFunctionEdit()) {
        changeTaskDef(window.application, taskId, taskDefData, properties);
    }
    else if(window.application.isFunctionDelete()) {
        deleteTaskDef(window.application, taskId);
    }

    window.application.navigateTo('taskdef.html');

});

function buildFormHtmlFromMetadata(propData: ClassMetadata): string[]  {
    /*
    let formHtml = '<input type="hidden" class="form-control" id="task-id"><input type="hidden" class="form-control" id="edit-mode">';
          
    formHtml += '<div class="mb-3"><label for="recipient-name" class="col-form-label">Name:</label><input type="text" class="form-control" id="task-name"></div>'
                + '<div class="mb-3"><label for="message-text" class="col-form-label">Description:</label><input type="text" class="form-control" id="proc-descr"></div>'

    */

    let formHtml : string[] = [];


    for(let propName in propData) {
        const prop = propData[propName];

        //  Label:
        let field = `<div class="input-group input-group-sm mb-3 task-prop-group ${prop.connector?"task-prop-conn":""}">`
        field +=  `<span class="input-group-text" title="${prop.description}">${prop.name}${prop.optional?"":"*"}</span>`
        
        switch(prop.propertyType) {

            case "CHOICE":
                field += `<select class="form-select" data-prop-name="${prop.name}"><option selected>Select an Option</option>`
                for(let i=0;i<prop.choiceValues.length;i++) {
                    field += `<option value="${prop.choiceValues[i]}">${prop.choiceValues[i]}</option>`;
                }
                field += "</select>";
                break;
            case "BOOLEAN":
                //field += `<input type="checkbox" class="form-check-input task-prop" data-prop-name="${prop.name}" ${(prop.optional?"":"required")}>`

                field += `&nbsp;<div class="form-check form-switch">
                <input class="form-check-input task-prop" data-prop-name="${prop.name}" type="checkbox" role="switch">
                <label class="form-check-label">${prop.description}</label>
              </div>`;


                break;
            default:
                field += `<input type="text" class="form-control task-prop" data-prop-name="${prop.name}" ${(prop.optional?"":"required")}>`;

        }

        field += `<div class="invalid-feedback">Please enter a value for ${prop.name}.</div>`;

        field += "</div>";
        formHtml.push(field);

    }

    return formHtml;
}

$(
    function() {
        const className = window.application.sessionData.get("className");
        getClassMetadata(window.application, className).then(

            (classMetadata:ClassMetadata) => {

                for(let field of buildFormHtmlFromMetadata(classMetadata)) {
                    $("#frmProperties").append(field);
                }

                if(window.application.isFunctionEdit()) {
                    const properties: {[name: string] : string} = window.application.sessionData.get("task-properties");

                    for(const name in properties) {
                        $(`[data-prop-name="${name}"]`).val(properties[name]);
                    }
                }

        });

    }
)