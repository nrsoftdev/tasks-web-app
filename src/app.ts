import { CommonData } from "./appdata";
import { Metadata } from "./metadata/metadata";

enum Function {
    /** Initial value */
    NONE,
    /** Creating new entity */
    NEW,
    /** Chaning entity */
    EDIT,
    /** deleting entity */
    DELETE,
    /** creating new child to existing entity */
    NEW_CHILD,
    /** adding child to existing entity */
    ADD_CHILD
}

enum Entity {
    TASK,
    PROCESS
}


class Application {


    public config = {urlSvc : ''};

    public currentUser: string="";

    private data:CommonData | null = null;

    constructor() {
        this.config.urlSvc = 'http://localhost:9000/tasks-svc/rest';
    }

    /** Generic ID currently in edit */
    public currentId: string = "";
    /** Generic current parent ID */
    public currentParentId: string = "";

    public currentChildId: string = "";

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

    public setFunctionAddChild() {
        this.currentFunction = Function.ADD_CHILD;
    }

    public isFunctionAddChild() : boolean {
        return this.currentFunction == Function.ADD_CHILD;
    }

    public clearCurrentFunction(): void {
        this.currentFunction = Function.NONE;
    }

    public getApplicationData(): CommonData | null  {
        return this.data;
    }

    public setApplicationData(data: CommonData) {
        this.data = data;
    }

    public clearApplicationData() {
        this.data = null;
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


