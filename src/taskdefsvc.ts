import { ApplicationData } from "./appdata";

export function getTaskDefList(appData: ApplicationData, currentPageNum : number, pageSize: number ) : JQuery.jqXHR {


    const url = appData.config.urlSvc + '/task';
    return $.ajax(
        url, {'method': 'GET', 'data': {'pageNum': currentPageNum, 'pageSize': pageSize}}
    );    
}

export function getTaskDefChildrenList(appData: ApplicationData, taskId : string, currentPageNum : number, pageSize: number ) : JQuery.jqXHR {


    const url = appData.config.urlSvc + '/task/' + taskId + '/children';
    return $.ajax(
        url, {'method': 'GET', 'data': {'pageNum': currentPageNum, 'pageSize': pageSize}}
    );    
}

export type TaskDefSerachFilters = { name?: string, description?: string, classname?: string }

export function searchTaskDefList(appData: ApplicationData, filters: TaskDefSerachFilters, currentPageNum : number, pageSize: number ) : JQuery.jqXHR {

    let data : any = filters;
    
    data.pageNum = currentPageNum;
    data.pageSize = pageSize;

    const url = appData.config.urlSvc + '/task/search';
    return $.ajax(
        url, {'method': 'GET', 'data': data}
    );    
}


export function getTaskDef(appData: ApplicationData, taskId : string ) : JQuery.Promise<TaskDefData> {


    const url = appData.config.urlSvc + '/task/' + taskId;
    return $.get(url).then( function(data) { return data} );    
}


export type TaskDefData = { name: string, description : string, user: string, properties: string , className: string, connectorName: string};

export function saveTaskDef(appData: ApplicationData, taskDefData: TaskDefData, properties: {[k: string]: string}): JQuery.jqXHR {

    taskDefData.user = appData.currentUser;
    taskDefData.properties = JSON.stringify(properties);
    const url = appData.config.urlSvc + '/task';
    return $.ajax(url, {'method' : 'POST','data' : taskDefData});        
}


//    return $.ajax(url + "/ip", {'method' : 'PATCH', 'data' : { 'user': appData.currentUser, 'properties': JSON.stringify(properties) } } );

export function changeTaskDef(appData: ApplicationData, taskId: string, taskDefData: TaskDefData, properties: {[k: string]: string})  {
    const url = appData.config.urlSvc + '/task/' + taskId;
    taskDefData.user = appData.currentUser;
    taskDefData.properties = JSON.stringify(properties);

    return $.ajax(url, {'method' : 'PATCH', 'data' : taskDefData})
    .then(
        function(data) : JQuery.jqXHR {
            return $.ajax(url + "/ip"
            , {'method' : 'PATCH', 'data' : { 'user': appData.currentUser, 'properties': JSON.stringify(properties) } } );
        }
    );
     
}



export function deleteTaskDef(appData: ApplicationData, taskId: string): JQuery.jqXHR {
    const url = appData.config.urlSvc + '/task' + "/" + taskId;
    return $.ajax({
        'url': url,
        'method': 'DELETE'
    });
}

export function saveChildrenTask(appData: ApplicationData
    , parentTaskId: string, taskDefData: TaskDefData, properties: {[k: string]: string}): JQuery.jqXHR {


        taskDefData.user = appData.currentUser;
        taskDefData.properties = JSON.stringify(properties);
        const url = appData.config.urlSvc + '/task/' + parentTaskId + "/children";
        return $.ajax(url, {'method' : 'POST','data' : taskDefData});          
}
