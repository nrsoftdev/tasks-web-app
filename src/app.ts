import { ApplicationData } from "./appdata";
import { Metadata } from "./metadata/metadata";

enum Function {
    NONE,
    NEW,
    EDIT,
    DELETE
}


class Application extends ApplicationData {

    /*
    public config = {urlSvc : 'http://localhost:9000/tasks-svc/rest'};

    public currentUser: string="";
*/

    constructor() {
        super();
        this.config.urlSvc = 'http://localhost:9000/tasks-svc/rest';
    }

    private sessionData : Map<string, any> = new Map<string, any>();

    public metadata: Metadata = {};

    public navigateTo(pageName:string): void {
        $("#appContainer").load(pageName);
    }
    

    private currentFunction : Function = Function.NONE;

    public getCurrentFunction(): Function {
        return this.currentFunction;
    }

    public isFunctionNew() : boolean {
        return this.currentFunction == Function.NEW;
    }

    public isFunctionEdit() : boolean {
        return this.currentFunction == Function.EDIT;
    }

    public isFunctionDelete() : boolean {
        return this.currentFunction == Function.DELETE;
    }

    public setFunctionNew() : void {
        this.currentFunction = Function.NEW;
    }

    public setFunctionEdit() : void {
        this.currentFunction = Function.EDIT;
    }

    public setFunctionDelete() : void {
        this.currentFunction = Function.DELETE;
    }

    public clearCurrentFunction(): void {
        this.currentFunction = Function.NONE;
    }
}


interface AppWindow extends Window {
    application : Application;
}





function getStringValue(value: string | number | string[] | undefined): string {

    let stringValue = "";
    if(value == undefined) 
        stringValue = "";
    else if(typeof value == "number" || typeof value == "string" ) {
        stringValue = String(value);
    } else if(typeof value?.length != "undefined" ) {
        stringValue = value[0];
    }

    return stringValue;
}

// export features declared earlier
export { Application, AppWindow, getStringValue };


