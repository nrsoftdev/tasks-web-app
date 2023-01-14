import { Application } from "./app";
import { JdbcConnData, TextConnData } from "./appdata";




export function getTextConn(appData: Application, connId: string) : JQuery.jqXHR<TextConnData> {
    return getConn('text', appData, connId)
}   

export function getTextConnList(appData: Application) : JQuery.Promise<TextConnData[]> {
    return getConnList('text', appData).then( dataToTextConnData ); 
}

export function deleteTextConn(appData: Application, data: TextConnData): JQuery.jqXHR {
    return deleteConn('text', appData, data.connId);
}

export function checkTextConn(appData: Application, data: TextConnData): JQuery.jqXHR {
    return checkConn('text', appData, data.connId);
}

export function checkJdbcConn(appData: Application, data: TextConnData): JQuery.jqXHR {
    return checkConn('jdbc', appData, data.connId);
}

export function changeTextConn(appData: Application, data: TextConnData): JQuery.jqXHR {
    let url = appData.config.urlSvc + '/textconn/'+ data.connId;
    return $.ajax(
        url,
        {
        'method': 'POST',
        data: {description: data.description
                , name: data.name
                , filename: data.filename
                , user: appData.currentUser 
            }
        }
    );
}

export function getJdbcConn(appData: Application, connId: string) : JQuery.jqXHR {
    return getConn('jdbc', appData, connId);
}   

export function getJdbcConnList(appData: Application) : JQuery.Promise<JdbcConnData[]> {
    return getConnList('jdbc', appData).then( dataToJdbcConnData ); 
}

export function deleteJdbcConn(appData: Application, data: JdbcConnData): JQuery.jqXHR {
    return deleteConn('jdbc', appData, data.connId);
}

export function changeJdbcConn(appData: Application, data: JdbcConnData): JQuery.jqXHR {
    let url = appData.config.urlSvc + '/jdbcconn/'+ data.connId;
    data.user = appData.currentUser;
    return $.ajax(url, {'method': 'POST', 'data': data.asObject()});
}

function dataToJdbcConnData(data:any): JdbcConnData[] { 

    let list: JdbcConnData[] = [];
    for(let i=0;i<data.length;i++)
        list.push(new JdbcConnData(data[i]));    
    return list;
} 

function dataToTextConnData(data:any): TextConnData[] { 

    let list: TextConnData[] = [];
    for(let i=0;i<data.length;i++)
        list.push(new TextConnData(data[i]));    
    return list;
}



function getConn(type:string, appData: Application, connId: string) : JQuery.jqXHR {

    const url = appData.config.urlSvc + '/' + type +'conn/'+ connId;
    return $.get(url);
}

function getConnList(type:string, appData: Application) : JQuery.jqXHR {
    const url = appData.config.urlSvc + '/'+type+'conn';
    return $.get(url);
}

function deleteConn(type:string, appData: Application, connId: string): JQuery.jqXHR {
    const url = appData.config.urlSvc + '/' + type+ 'conn/'+ connId;
    return $.ajax(url, {'method': 'DELETE'});
}

function checkConn(type:string, appData: Application, connId: string): JQuery.jqXHR {
    const url = appData.config.urlSvc + '/' + type+ 'conn/'+ connId + "/check";
    return $.get(url);
}


