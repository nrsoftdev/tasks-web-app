import { ApplicationData } from "./appdata";



export function getTextConn(appData: ApplicationData, connId: number) : JQuery.jqXHR {
    return getConn('text', appData, connId);
}   

export function getTextConnList(appData: ApplicationData) : JQuery.jqXHR {
    return getConnList('text', appData);
}

export function deleteTextConn(appData: ApplicationData, connId: number): JQuery.jqXHR {
    return deleteConn('text', appData, connId);
}

export function changeTextConn(appData: ApplicationData, connId: number, data: any): JQuery.jqXHR {
    let url = appData.config.urlSvc + '/textconn/'+ connId;
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

export function getJdbcConn(appData: ApplicationData, connId: number) : JQuery.jqXHR {
    return getConn('jdbc', appData, connId);
}   

export function getJdbcConnList(appData: ApplicationData) : JQuery.jqXHR {
    return getConnList('jdbc', appData);
}

export function deleteJdbcConn(appData: ApplicationData, connId: number): JQuery.jqXHR {
    return deleteConn('jdbc', appData, connId);
}

export function changeJdbcConn(appData: ApplicationData, connId: number, data: any): JQuery.jqXHR {
    let url = appData.config.urlSvc + '/jdbcconn/'+ connId;
    data.user = appData.currentUser;
    return $.ajax(url, {'method': 'POST', 'data': data});
}





function getConn(type:string, appData: ApplicationData, connId: number) : JQuery.jqXHR {

    const url = appData.config.urlSvc + '/' + type +'conn/'+ connId;
    return $.get(url);
}

function getConnList(type:string, appData: ApplicationData) : JQuery.jqXHR {
    const url = appData.config.urlSvc + '/'+type+'conn';
    return $.get(url);
}

function deleteConn(type:string, appData: ApplicationData, connId: number): JQuery.jqXHR {
    const url = appData.config.urlSvc + '/' + type+ 'conn/'+ connId;
    return $.ajax(url, {'method': 'DELETE'});
}


