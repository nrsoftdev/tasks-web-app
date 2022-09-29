export abstract class CommonData {
    public name: string="";
    public description : string="";
    public user: string="";
    public properties: {[k: string]: string} = {};


    public constructor(data?:any) {  
        if(data) {
            this.name = data.name?data.name:"";
            this.description = data.description?data.description:"";
            this.user = data.user?data.user:"";
            this.properties = data.properties?data.properties:{};
        }
    }

    public  asObject(): any {
        return { 'name' : this.name
        , 'description' : this.description
        , 'user' : this.user
        , 'properties' : JSON.stringify(this.properties) 
        }  
    }
}


export class JdbcConnData  extends CommonData  {

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

export class TextConnData  extends CommonData  {

    public connId: string="";
    public filename: string="";

    public constructor(data?:any) { 
        super(data);
        if(data) {
            this.filename = data.filename;
            this.connId = data.connId;
        }
     }
 
}

export class ProcessDefData extends CommonData {
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

    public  asObject(): any {

        let o = super.asObject();
        o.processId = this.processId;
        o.version = this.version;
        o.taskDefinitionId = this.taskDefinitionId; 
        return o;
    } 
}

export class TaskDefData extends CommonData  { 

    public taskId: string="";
    public parentTaskId: string="";
    public className: string="";
    public connectorName: string="";

    public readonly allowsChildren: boolean = false;
    public readonly children : number = 0;


    public constructor(data?:any) { 
        super(data);
        if(data) {
            this.taskId = data.taskId?data.taskId:"";
            this.parentTaskId = data.parentTaskId?data.parentTaskId:"";
            this.className = data.className?data.className:"";
            this.connectorName = data.connectorName?data.connectorName:"";
            this.allowsChildren = data.allowsChildren?data.allowsChildren:false;
            this.children = data.children?data.children:0;
        } 
    }

    public  asObject(): any {

        let o = super.asObject();
        o.taskId = this.taskId;
        o.parentTaskId = this.parentTaskId;
        o.className = this.className;
        o.connectorName = this.connectorName;
        return o;
    }    


};