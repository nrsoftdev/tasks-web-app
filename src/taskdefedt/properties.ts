import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Application, AppWindow, getStringValue } from '../app';
import { ClassMetadata, getClassMetadata } from '../metadata/metadata';
import { changeTaskDef, deleteTaskDef, saveChildrenTask, saveTaskDef } from '../taskdefsvc';
import { TaskDefData } from '../appdata';



declare let window : AppWindow;

let classMetadata:ClassMetadata;

$('#btnPrevious').on('click',
function() {
    window.application.navigateTo('taskdefedt/basic.html');
}
);

$('#btnConfirm').on('click',
function() {

    const taskDefData : TaskDefData = window.application.getApplicationData() as TaskDefData;

    let properties: {[k: string]: string} = {};



    $(".task-prop").each(
        function (this: HTMLElement, index: number, element: HTMLElement) : false | void {

            const propName = String($(element).data("prop-name"));
            let value = getStringValue($(element).val());
           
            switch(classMetadata[propName].propertyType) {
                case 'BOOLEAN':
                    value = String($(element).prop('checked'));
                    break;
            } 

            properties[ propName ] = value;
        }
    );
   
    if(window.application.isFunctionNew()) {

        if(taskDefData.parentTaskId) {
            saveChildrenTask(window.application, taskDefData);
        } else {
            saveTaskDef(window.application, taskDefData, properties);
        }
    }
    else if(window.application.isFunctionEdit()) {
        changeTaskDef(window.application, taskDefData, properties);
    }
    else if(window.application.isFunctionDelete()) {
        deleteTaskDef(window.application, taskDefData.taskId);
    }

    window.application.navigateTo('taskdef.html');

});

function buildFormHtmlFromMetadata(propData: ClassMetadata, connectorName:string): string[]  {
    /*
    let formHtml = '<input type="hidden" class="form-control" id="task-id"><input type="hidden" class="form-control" id="edit-mode">';
          
    formHtml += '<div class="mb-3"><label for="recipient-name" class="col-form-label">Name:</label><input type="text" class="form-control" id="task-name"></div>'
                + '<div class="mb-3"><label for="message-text" class="col-form-label">Description:</label><input type="text" class="form-control" id="proc-descr"></div>'

    */

    let formHtml : string[] = [];


    for(let propName in propData) {
        const prop = propData[propName];
        
        if(!prop.connector || (prop.connector && connectorName=="")) {

            //  Label:
            let field = `<div class="input-group input-group-sm mb-3 task-prop-group}">`
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
    }

    return formHtml;
}

$(
    function() {

        const taskDefData : TaskDefData = window.application.getApplicationData() as TaskDefData;
        const className = taskDefData.className;
        getClassMetadata(window.application, className).then(

            (_classMetadata:ClassMetadata) => {

                classMetadata = _classMetadata;

                for(let field of buildFormHtmlFromMetadata(classMetadata, taskDefData.connectorName)) {
                    $("#frmProperties").append(field);
                }

                if(window.application.isFunctionEdit()) {
                   
                    for(const name in taskDefData.properties) {

                        let value = taskDefData.properties[name];

                        

                        switch(classMetadata[name].propertyType) {
                            case 'BOOLEAN':
                                $(`[data-prop-name="${name}"]`).prop('checked', value=="true");
                                break;
                            default:
                                $(`[data-prop-name="${name}"]`).val(value);
                                break;
                        } 

                        
                    }
                }

        });

    }
)