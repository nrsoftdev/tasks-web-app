import 'bootstrap/dist/css/bootstrap.min.css';
//import $ from "jquery";
//import "bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

import { AppWindow } from '../app';
import * as procdefsvc  from '../procdefsvc';
import { ProcessDefData } from '../appdata';

declare let window : AppWindow;


let variables: any[] = [];

$('#btnPrev').on('click',
function() {
    if(window.application.isFunctionNew())
        window.application.navigateTo('procdefedt/task.html');
    else
        window.application.navigateTo('procdefedt/basic.html');
}
);

$('#btnConfirm').on('click',
function() {
    let processDefData = window.application.getApplicationData() as ProcessDefData;
    processDefData.variables = variables;
    saveProcDef();
}
);


let currentProcDefId = 0;

function saveProcDef() {
    


    // POST:
    // procdef
    // user, name, description, taskDefinitionId

    // Output: data.processId

    // procdef/{id}/0/vars/{varname}
    // user, type, value

    let processDefData = window.application.getApplicationData() as ProcessDefData;
    let url = window.application.config.urlSvc + "/procdef";
    let data = {user: window.application.currentUser
        , name: processDefData.name
        , description: processDefData.description
        , taskDefinitionId: processDefData.taskDefinitionId
    };
   
    if(window.application.isFunctionNew()) {

        $.post(
            url,
            data,
            postSuccessFn,
        ).then(
            function () {

                let vars = [];
                for(let variable of processDefData.variables) {

                    let url = window.application.config.urlSvc + `/procdef/${currentProcDefId}/0/vars/${variable.name}`;
                    let data = { user : window.application.currentUser, type: variable.type, value: variable.value};
                    vars.push( $.post(url, data) );
                }

                return $.when(vars);
            }
        ).done(
            endProcessDefOperation
        );
    } else if(window.application.isFunctionEdit()) {

        $.ajax(
            {
                'url': url+ "/" 
                    + processDefData.processId
                    + "/" + processDefData.version,
                'method': 'PATCH',
                'data' : data
            }
        ).then(
            function () {
                return $.ajax({
                    'method': 'PATCH',
                    'url' : url+ "/" 
                        + processDefData.processId 
                        + "/" + processDefData.version + "/vars"
                    , 'data' : {'variables' : JSON.stringify(variables)}
                }
                );
            }
        ).done(
            endProcessDefOperation
        );

    }


}


function endProcessDefOperation() {
    window.application.clearApplicationData();
    variables = [];
    window.application.navigateTo('processdef.html');
}


function postSuccessFn(data:any) {
    currentProcDefId = data.processId;
}

function loadVariables() {
    $("#procdefvars").find('tbody').empty();
    let id = 0;
    for(let variable of variables) {
        $("#procdefvars").find('tbody').append(`<tr id="r${id++}"><th scope="row">`
        + `<a class="btn btn-primary start-delete" data-varname="${variable.name}" role="button" href='#'><i class="bi bi-trash-fill"></i></a>`
        + `</th>`
        + `<td>${variable.name}</td>`
        + `<td>${variable.type}</td>`
        + `<td>${variable.value}</td>`
        + `</tr>`
        )
    
    }

    $('.start-delete').on("click", 
        function() {
            const varname= $(this).data("varname");
            let id="";
            for(const variable in variables) {
                if(variables[variable].name===varname) {
                    id = variable;
                }
            }
            if(id!="") {
                variables.splice(Number(id),1);
                $("#r" + id).remove();
            }

        }
    );
}

$('#btnAddVar').on("click",
    function() {

        variables.push({
        'name': $('#var-name').val(),
        'type': $('#var-type').val(),
        'value': $('#var-default').val()
        });


        $("#procdefvars").find('tbody').append(`<tr><th scope="row">`
        + `<a class="btn btn-primary" role="button" href='#'><i class="bi bi-trash-fill"></i></a>`
        + `</th>`
        + `<td>${$('#var-name').val()}</td>`
        + `<td>${$('#var-type').val()}</td>`
        + `<td>${$('#var-default').val()}</td>`
        + `</tr>`
        )

    }
);


$(function()
{

    let processDefData = window.application.getApplicationData() as ProcessDefData;
    $('#proc-name').text(processDefData.name);
    $('#proc-descr').text(processDefData.description);

    if(window.application.isFunctionEdit())
        procdefsvc.getVariables(window.application, processDefData.processId, processDefData.version)
        .then(
            function(data) {
                variables = data;
                loadVariables();
            }
        );
});