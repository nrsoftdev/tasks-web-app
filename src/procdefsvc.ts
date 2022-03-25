import { ApplicationData } from "./appdata";

export function getProcessDef(appData: ApplicationData, processId: any, version: any) 
: JQuery.jqXHR
{

    let url = appData.config.urlSvc + '/procdef/'+ processId + "/" + version;
    return $.get(
        url
    );
}

export function getProcessList(appData: ApplicationData) 
: JQuery.jqXHR
{

    let url = appData.config.urlSvc + '/procdef';
    return $.get(
        url
    );
}

export function deleteProcessDef(appData: ApplicationData, processId: any, version: any)
: JQuery.jqXHR {
    let url = appData.config.urlSvc + '/procdef/'+ processId +"/"+version;
    return $.ajax(
        url,
        {
        'method': 'DELETE',
        });
}

export function changeProcessDef(appData: ApplicationData, processId: any, version: any, data: any)
: JQuery.jqXHR {
    let url = appData.config.urlSvc + '/procdef/'+ processId+"/"+version;
    return $.ajax(
        url,
        {
        'method': 'PATCH',
        data: {description: data.description, user: appData.currentUser }
        }
    );
}

export function runProcess(appData: ApplicationData, processId: any, version: any) : JQuery.jqXHR {

    let url = appData.config.urlSvc + '/procdef/run/' + processId + "/" + version + "?user=" + appData.currentUser;
    return $.ajax(
        url,
        {
    
        'method': 'GET'
        }
    );
}

export function getVariables(appData: ApplicationData, processId: any, version: any) : JQuery.jqXHR {
    let url = appData.config.urlSvc + '/procdef/' + processId + "/" + version + "/vars";
    return $.get(
        url
    );

}