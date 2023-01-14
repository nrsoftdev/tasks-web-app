export abstract class CommonData {

    public abstract getId() : string;


    public constructor(data?:any) { }
}

export abstract class CommonDefData extends CommonData {
    public name: string="";
    public description : string="";
    public user: string="";
    public properties: {[k: string]: string} = {};


    public constructor(data?:any) {  
        super(data);
        if(data) {
            this.name = data.name?data.name:"";
            this.description = data.description?data.description:"";
            this.user = data.user?data.user:"";
            this.properties = data.properties?data.properties:{};
        }
    }

    public allowsChildren(): boolean { return false };
    
    public children(): number { return 0 };    

    public  asObject(): any {
        return { 'name' : this.name
        , 'description' : this.description
        , 'user' : this.user
        , 'properties' : JSON.stringify(this.properties) 
        }  
    }

    public getDescription() : string {
        return this.description;
    }    
}


export class JdbcConnData  extends CommonDefData  {

    public connId: string="";
    public driver: string="";
    public url: string="";
    public dbuser: string="";
    public password: string="";

    public constructor(data?:any) { 
        super(data);
        if(data) {
            this.driver = data.driver;
            this.connId = data.connId;
            this.url = data.url;
            this.dbuser = data.dbuser;
            this.password = data.password;
        }
     }

     public getId(): string {
        return this.connId;
     }

     public  asObject(): any {

        let obj = super.asObject();
        
        obj. connId = this.connId;
        obj. driver = this.driver;
        obj. url = this.url;
        obj. dbuser = this.dbuser;
        obj. password = this.password;
        return obj;
    }     

}

export class TextConnData  extends CommonDefData  {

    public connId: string="";
    public filename: string="";

    public constructor(data?:any) { 
        super(data);
        if(data) {
            this.filename = data.filename;
            this.connId = data.connId;
        }
     }
     public getId(): string {
        return this.connId;
     }     
 
}

export class ProcessDefData extends CommonDefData {
    public processId: string="";
    public version: string="";

    public taskDefinitionId: string="";

    public variables: any[] = [];


    public readonly taskDefinitionDescription: string="";
    public readonly taskDefinitionName: string="";

    public constructor(data?:any) { 
        super(data);
        if(data) {
            this.processId = data.processId?data.processId:"";
            this.version = data.version?data.version:"";
            this.taskDefinitionId = data.taskDefinitionId?data.taskDefinitionId:"";
            this.taskDefinitionDescription = data.taskDefinitionDescription?data.taskDefinitionDescription:"";
            this.taskDefinitionName = data.taskDefinitionName?data.taskDefinitionName:"";
        } 
    }
    public getId(): string {
        return this.processId;
     }

    public  asObject(): any {

        let o = super.asObject();
        o.processId = this.processId;
        o.version = this.version;
        o.taskDefinitionId = this.taskDefinitionId; 
        return o;
    } 
}

export class TaskDefData extends CommonDefData  { 

    public taskId: string="";
    public parentTaskId: string="";
    public className: string="";
    public connectorName: string="";

    private _allowsChildren: boolean = false;
    private _children : number = 0;


    public constructor(data?:any) { 
        super(data);
        if(data) {
            this.taskId = data.taskId?data.taskId:"";
            this.parentTaskId = data.parentTaskId?data.parentTaskId:"";
            this.className = data.className?data.className:"";
            this.connectorName = data.connectorName?data.connectorName:"";
            this._allowsChildren = data.allowsChildren?data.allowsChildren:false;
            this._children = data.children?data.children:0;
        } 
    }

    public getId(): string {
        return this.taskId;
     } 
     
     public allowsChildren(): boolean { return this._allowsChildren };
     public children(): number { return this._children };     

    public  asObject(): any {

        let o = super.asObject();
        o.taskId = this.taskId;
        o.parentTaskId = this.parentTaskId;
        o.className = this.className;
        o.connectorName = this.connectorName;
        return o;
    }    


};

export class ProcessData extends CommonData {

	private processId: string="";
	public status: string="";
	public startTime: string="";
	public endTime: string="";
	public owner: string="";
	public processDefId: string="";
	public processDefVersion: string="";
	public resultMessage: string="";

    public constructor(data?:any) { 
        super(data);
        if(data) {
            this.processId = data.processId;
            this.status = data.status;
            this.startTime = data.startTime;
            this.endTime = data.endTime;
            this.owner = data.owner;
            this.resultMessage = data.resultMessage;
        }
     }

    public getId(): string {
        return this.processId;
    }

    public getStatusDescription(): string {
        let description = "";
        switch(this.status) {
            case "10":  
                description = "CREATED";
                break;
	        case "20":  
                description = "RUNNING";
                break;
	        case "30":  
                description = "ENDED_OK";
                break;
	        case "40":  
                description = "ENDED_ERROR";
                break;
	        case  "90":  
                description = "CLOSED";
                break;
        }
        return description;
    }
}

export type ResponseKind = "ERROR" | "WARNING" | "INFO";


export type ResponseDetail = {
	resource : string;
	responseKind: ResponseKind;
	field: string;
	code: string;
	message: string;
}