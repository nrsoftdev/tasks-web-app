import { Application, getStringValue } from "./app";
import { CommonData, TaskDefData } from "./appdata";
import { ActionButttonDefinition, ColumnInfoType, HtmlTable, HtmlTableOptions, HtmlTablePaginationOptions, ToolbarButton } from "./htmltable";
import { getTaskDefChildrenList, getTaskDefList, searchTaskDefList } from "./taskdefsvc";





export class TaskTable extends HtmlTable {

  protected buildActionRowButtonDefs(data:CommonData): ActionButttonDefinition[] {
    let actionButttonDefinitions: ActionButttonDefinition[] = [];
    
    let taskData : TaskDefData = data as TaskDefData;

    let actionButttonDefinition: ActionButttonDefinition
      =new ActionButttonDefinition(taskData.getId(), "btn btn-primary btn-sm start-edit", "bi-pencil-square" );    
    actionButttonDefinitions.push(actionButttonDefinition);

    let addDeleteBtn = true;
    let btnClass = "btn-primary";
    if(this.navigationCurrentId.length>0)
      btnClass = "btn-secondary"
    if(taskData.allowsChildren()) {
      addDeleteBtn = taskData.children()==0;
    }
    if(addDeleteBtn) {
      let deleteActionButttonDefinition: ActionButttonDefinition
        =new ActionButttonDefinition(taskData.getId(), `btn ${btnClass} btn-sm start-delete`, "bi-trash-fill");
      actionButttonDefinitions.push(deleteActionButttonDefinition);
    }   

    return actionButttonDefinitions;
  }

  constructor(selector:string
    , appData: Application
    , options: HtmlTableOptions | null = null
    , paginationOptions: HtmlTablePaginationOptions | null = null) {

    super(selector,'task', appData, options, paginationOptions,
    [
      { id: "backBtn", initialDisplay: "", icon: "bi-arrow-up-square-fill"},
      { id: "refreshBtn", initialDisplay: "", icon: "bi-arrow-clockwise"},
      { id: "newBtn" , initialDisplay: "", icon: "bi-plus-square-fill"},
      { id: "searchBtn", initialDisplay: "none" , icon: "bi-search"},
      { id: "confirmBtn", initialDisplay: "none" , icon: "bi-check-square-fill"},
      { id: "cancelBtn", initialDisplay: "none", icon: "bi-x-square-fill"}
    ]     
    );
    this.columnsInfo = [{name: 'Actions', width:"10%", filterType:"NONE"},
    {name: 'Name', width:"15%", filterType:"TEXT"},
    {name:'Description', width:"", filterType:"TEXT"},
    {name: 'Class Name', width:" 20%", filterType:"SELECT"},
    {name: 'Children', width:"10%", filterType:"NONE"}];
    
  }

  protected getChildrenDataList(parentId: string): JQuery.Promise<CommonData[]> {
    return getTaskDefChildrenList(this.appData, parentId, this.currentPageNum, this.paginationOptions.pageSize );
  }

  protected getDataList(pageNum:number): JQuery.Promise<CommonData[]> {
    let newPageNum = this.currentPageNum;
    if(pageNum>0)
      newPageNum = pageNum;
    return getTaskDefList(this.appData, newPageNum, this.paginationOptions.pageSize)
  }

  protected searchDataList(filters:any): JQuery.Promise<CommonData[]> {
    return searchTaskDefList(this.appData, filters, this.currentPageNum, this.paginationOptions.pageSize);
  }

  protected getTableColumnsForData(data: CommonData): string {
    let taskDefData : TaskDefData = data as TaskDefData;
    return `<td>${taskDefData.name}</td>`
    + `<td>${taskDefData.description?taskDefData.description:""}</td>`
    + `<td>${taskDefData.className?taskDefData.className:""}</td>`
    + `<td>${taskDefData.allowsChildren()?`<a class="btn btn-primary start-children" data-itemId="${taskDefData.taskId}" role="button" href="#"><i class="bi bi-three-dots"></i></a>`:""}</td>`;
  }

  /**
   * Use classes text-filter-change and select-filter-change
   * @param column 
   * @returns 
   */
  protected getColumnHeader(column: ColumnInfoType): string
  {

    if(this.options?.filters) {
        if(column.name == "Name" || column.name=="Description")
            return `<input type="text" id="filter-${column.name.toLowerCase()}"  class="form-control text-filter-change" placeholder="${column.name}">`

        if(column.name == "Class Name")
          return `<select class="form-select select-filter-change" id="filter-classname"><option selected value="">Class Name</option></select>`;
        
    }
    return column.name;
  }

  protected getColumnFilters(): any {

    
    let name : string = String($("#filter-name").val());
    let desc : string = String($("#filter-description").val())

    if(name!=="") name = "%" + name + "%";
    if(desc!=="") desc = "%" + desc + "%";

    let classname = getStringValue($("#filter-classname").val());
    return {'name': name, 'description' : desc, 'className' : classname};
  }
  
}


