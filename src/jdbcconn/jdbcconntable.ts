import { Application, getStringValue } from "../app";
import { CommonData, JdbcConnData } from "../appdata";
import { getJdbcConnList } from "../connsvc";
import { ActionButttonDefinition, ColumnInfoType, HtmlTable, HtmlTableOptions, HtmlTablePaginationOptions, ToolbarButton } from "../htmltable";

export class JdbcConnTable extends HtmlTable {
  protected buildActionRowButtonDefs(data: CommonData): ActionButttonDefinition[] {
    let jdbcConnData : JdbcConnData = data as JdbcConnData;
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

    super(selector,'jdbcconn', appData, options, paginationOptions, [      { id: "refreshBtn", initialDisplay: "", icon: "bi-arrow-clockwise"},
    { id: "newBtn" , initialDisplay: "", icon: "bi-plus-square-fill"}]  );
    this.columnsInfo = [{name: 'Actions', width:"15%", filterType:"NONE"},
    {name: 'Name', width:"15%", filterType:"TEXT"},
    {name:'Description', width:"", filterType:"TEXT"},
    {name: 'Driver', width:" 20%", filterType:"NONE"},
    {name: 'Url', width:"10%", filterType:"NONE"},
    {name: 'User', width:"10%", filterType:"NONE"}];

  }

  protected getChildrenDataList(parentId: string): JQuery.Promise<CommonData[]> {
    return getJdbcConnList(this.appData );
  }

  protected getDataList(pageNum:number): JQuery.Promise<CommonData[]> {
    let newPageNum = this.currentPageNum;
    if(pageNum>0)
      newPageNum = pageNum;
    return  getJdbcConnList(this.appData );
  }

  protected searchDataList(filters:any): JQuery.Promise<CommonData[]> {
    return  getJdbcConnList(this.appData );
  }

  protected getTableColumnsForData(data: CommonData): string {
    let jdbcConnData : JdbcConnData = data as JdbcConnData;
    return `<td>${jdbcConnData.name}</td>`
    + `<td>${jdbcConnData.description?jdbcConnData.description:""}</td>`
    + `<td>${jdbcConnData.driver?jdbcConnData.driver:""}</td>`
    + `<td>${jdbcConnData.url?jdbcConnData.url:""}</td>`
    + `<td>${jdbcConnData.user?jdbcConnData.user:""}</td>`
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


