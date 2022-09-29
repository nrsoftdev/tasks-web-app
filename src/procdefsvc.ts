import { Application } from "./app";
import { ProcessDefData } from "./appdata";

export function getProcessDef(appData: Application, processId: string, version: string) 
: JQuery.Promise<ProcessDefData> 
{

    let url = appData.config.urlSvc + '/procdef/'+ processId + "/" + version;
    return $.get(url).then( function(data) { 
        return new ProcessDefData(data);
    } );   
}

export function getProcessList(appData: Application) 
: JQuery.jqXHR
{

    let url = appData.config.urlSvc + '/procdef';
    return $.get(
        url
    );
}

export function deleteProcessDef(appData: Application, processId: any, version: any)
: JQuery.jqXHR {
    let url = appData.config.urlSvc + '/procdef/'+ processId +"/"+version;
    return $.ajax(
        url,
        {
        'method': 'DELETE',
        });
}

export function changeProcessDef(appData: Application, processId: any, version: any, data: any)
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

export function runProcess(appData: Application, processId: any, version: any) : JQuery.jqXHR {

    let url = appData.config.urlSvc + '/procdef/run/' + processId + "/" + version + "?user=" + appData.currentUser;
    return $.ajax(
        url,
        {
    
        'method': 'GET'
        }
    );
}

export function getVariables(appData: Application, processId: any, version: any) : JQuery.jqXHR {
    let url = appData.config.urlSvc + '/procdef/' + processId + "/" + version + "/vars";
    return $.get(
        url
    );

}