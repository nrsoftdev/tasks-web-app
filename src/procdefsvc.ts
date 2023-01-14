import { Application } from "./app";
import { ProcessData, ProcessDefData } from "./appdata";

export function getProcessDef(appData: Application, processId: string, version: string) 
: JQuery.Promise<ProcessDefData> 
{

    let url = appData.config.urlSvc + '/procdef/'+ processId + "/" + version;
    return $.get(url).then( function(data) { 
        return new ProcessDefData(data);
    } );   
}

export function getProcessDefList(appData: Application) 
: JQuery.jqXHR
{

    let url = appData.config.urlSvc + '/procdef';
    return $.get(
        url
    );
}

function dataToProcessData(data:any): ProcessData[] { 

    let list: ProcessData[] = [];
    for(let i=0;i<data.length;i++)
        list.push(new ProcessData(data[i]));    
    return list;
}


export function getProcessList(appData: Application, pageNum: number, pageSize: number) : JQuery.Promise<ProcessData[]> 
{

    let url = appData.config.urlSvc + '/process?pageNum=' + pageNum + '&pageSize=' + pageSize;
    return $.get(
        url
    ).then(dataToProcessData);
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

    let url = appData.config.urlSvc + '/process/run/' + processId + "/" + version + "?user=" + appData.currentUser;
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

export function generateProcess(application: Application, processId: any, version: any) {
    let url = application.config.urlSvc + '/procdef/generate/' + processId + "/" + version + "?user=" + application.currentUser;
    return $.ajax(
        url,
        {
    
        'method': 'GET'
        }
    );
}
