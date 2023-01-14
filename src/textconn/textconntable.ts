import { Application, getStringValue } from "../app";
import { CommonData, TextConnData } from "../appdata";
import { getTextConnList } from "../connsvc";
import { ActionButttonDefinition, ColumnInfoType, HtmlTable, HtmlTableOptions, HtmlTablePaginationOptions, ToolbarButton } from "../htmltable";

export class TextConnTable extends HtmlTable {
  
  protected buildActionRowButtonDefs(data: CommonData): ActionButttonDefinition[] {
    
    let actionButttonDefinitions: ActionButttonDefinition[] = [];

    actionButttonDefinitions.push(new ActionButttonDefinition(data.getId(),"btn btn-primary btn-sm start-edit", "bi-pencil-square"));
    actionButttonDefinitions.push(new ActionButttonDefinition(data.getId(),"btn btn-primary btn-sm start-delete", "bi-trash-fill"));
    actionButttonDefinitions.push(new ActionButttonDefinition(data.getId(),"btn btn-primary btn-sm start-check", "bi-file-check"));

    return actionButttonDefinitions;
  }


  
  OnStartCheck!: (event: JQuery.ClickEvent) => void;

  constructor(selector:string
    , appData: Application
    , options: HtmlTableOptions | null = null
    , paginationOptions: HtmlTablePaginationOptions | null = null) {

    super(selector,'textconn', appData, options, paginationOptions, 
      [{ id: "refreshBtn", initialDisplay: "", icon: "bi-arrow-clockwise"},
        { id: "newBtn" , initialDisplay: "", icon: "bi-plus-square-fill"}]  );

    this.columnsInfo = [{name: 'Actions', width:"15%", filterType:"NONE"},
    {name: 'Name', width:"15%", filterType:"TEXT"},
    {name:'Description', width:"", filterType:"TEXT"},
    {name: 'Filename', width:" 30%", filterType:"NONE"}];

  }

  protected getChildrenDataList(parentId: string): JQuery.Promise<CommonData[]> {
    return getTextConnList(this.appData );
  }

  protected getDataList(pageNum:number): JQuery.Promise<CommonData[]> {
    let newPageNum = this.currentPageNum;
    if(pageNum>0)
      newPageNum = pageNum;
    return  getTextConnList(this.appData );
  }

  protected searchDataList(filters:any): JQuery.Promise<CommonData[]> {
    return  getTextConnList(this.appData );
  }

  protected getTableColumnsForData(data: CommonData): string {
    let textConnData : TextConnData = data as TextConnData;
    return `<td>${textConnData.name}</td>`
    + `<td>${textConnData.description?textConnData.description:""}</td>`
    + `<td>${textConnData.filename?textConnData.filename:""}</td>`;
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
    }
    return column.name;
  }

  protected getColumnFilters(): any {

    
    let name : string = String($("#filter-name").val());
    let desc : string = String($("#filter-description").val())

    if(name!=="") name = "%" + name + "%";
    if(desc!=="") desc = "%" + desc + "%";


    return {'name': name, 'description' : desc};
  }

  protected setupCustomActions() : void {
    $(".start-check").on("click", this.OnStartCheck);
  }

  public setOnStartCheck(OnStartCheck: (event: JQuery.ClickEvent) => void) {
    this.OnStartCheck = OnStartCheck;
  }  
  
}


