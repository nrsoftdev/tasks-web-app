import { Application } from "./app";
import { TaskDefData } from "./appdata";

export function getTaskDefList(appData: Application, currentPageNum : number, pageSize: number ) 
//: JQuery.jqXHR
    : JQuery.Promise<TaskDefData[]> 
{


    const url = appData.config.urlSvc + '/task';
    return $.ajax(
        url, {'method': 'GET', 'data': {'pageNum': currentPageNum, 'pageSize': pageSize}}
    ).then( 
        function(data) { 

            let list: TaskDefData[] = [];
            for(let i=0;i<data.length;i++)
                list.push(new TaskDefData(data[i]));    
            return list;
        } 
    );          
}

export function getTaskDefChildrenList(appData: Application, taskId : string, currentPageNum : number, pageSize: number ) : JQuery.jqXHR {


    const url = appData.config.urlSvc + '/task/' + taskId + '/children';
    return $.ajax(
        url, {'method': 'GET', 'data': {'pageNum': currentPageNum, 'pageSize': pageSize}}
    );    
}

export type TaskDefSerachFilters = { name?: string, description?: string, classname?: string }

export function searchTaskDefList(appData: Application, filters: TaskDefSerachFilters, currentPageNum : number, pageSize: number ) : JQuery.jqXHR {

    let data : any = filters;
    
    data.pageNum = currentPageNum;
    data.pageSize = pageSize;

    const url = appData.config.urlSvc + '/task/search';
    return $.ajax(
        url, {'method': 'GET', 'data': data}
    );    
}


export function getTaskDef(appData: Application, taskId : string ) : JQuery.Promise<TaskDefData> {


    const url = appData.config.urlSvc + '/task/' + taskId;
    return $.get(url).then( function(data) { 
        return new TaskDefData(data);
    } );    
}




export function saveTaskDef(appData: Application, taskDefData: TaskDefData, properties: {[k: string]: string}): JQuery.jqXHR {

    let data 
    taskDefData.user = appData.currentUser;
    const url = appData.config.urlSvc + '/task';
    return $.ajax(url, {'method' : 'POST','data' : taskDefData.asObject()});        
}


//    return $.ajax(url + "/ip", {'method' : 'PATCH', 'data' : { 'user': appData.currentUser, 'properties': JSON.stringify(properties) } } );

export function changeTaskDef(appData: Application, taskDefData: TaskDefData, properties: {[k: string]: string})  {
    const url = appData.config.urlSvc + '/task/' + taskDefData.taskId;
    taskDefData.user = appData.currentUser;

    return $.ajax(url, {'method' : 'PATCH', 'data' : taskDefData.asObject()})
    .then(
        function(data) : JQuery.jqXHR {
            return $.ajax(url + "/ip"
            , {'method' : 'PATCH', 'data' : { 'user': appData.currentUser, 'properties': JSON.stringify(properties) } } );
        }
    );
     
}



export function deleteTaskDef(appData: Application, taskId: string): JQuery.jqXHR {
    const url = appData.config.urlSvc + '/task' + "/" + taskId;
    return $.ajax({
        'url': url,
        'method': 'DELETE'
    });
}

export function saveChildrenTask(appData: Application, taskDefData: TaskDefData): JQuery.jqXHR {
        taskDefData.user = appData.currentUser;
        const url = appData.config.urlSvc + '/task/' + taskDefData.parentTaskId + "/children";
        return $.ajax(url, {'method' : 'POST','data' : taskDefData.asObject()});          
}


export function attachChildrenTask(appData: Application): JQuery.jqXHR {
    const url = appData.config.urlSvc + '/task/' + appData.currentParentId + "/children/" + appData.currentChildId;
    return $.ajax(url, {'method' : 'PUT'});          
}

export function detachChildrenTask(appData: Application): JQuery.jqXHR {
    const url = appData.config.urlSvc + '/task/' + appData.currentParentId + "/children/" + appData.currentChildId;
    return $.ajax(url, {'method' : 'DELETE'});          
}

