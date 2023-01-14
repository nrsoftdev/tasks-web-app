import { Application } from "./app";
import { CommonData, ProcessData } from "./appdata";
import { ActionButttonDefinition, ColumnInfoType, HtmlTable, HtmlTableOptions, HtmlTablePaginationOptions, REFRESH_BTN_NAME, STANDARD_BTN_DEFS } from "./htmltable";
import { getProcessList } from "./procdefsvc";



export class ProcessTable extends HtmlTable {
  
  protected buildActionRowButtonDefs(data: CommonData): ActionButttonDefinition[] {
    let actionButttonDefinitions: ActionButttonDefinition[] = [];
    return actionButttonDefinitions;
  }

  
  
  constructor(selector:string
    , appData: Application
    , options: HtmlTableOptions | null = null
    , paginationOptions: HtmlTablePaginationOptions | null = null) {

    super(selector,'process', appData, options, paginationOptions, 
    [ STANDARD_BTN_DEFS[REFRESH_BTN_NAME]]  );
    this.columnsInfo = [
    {name: 'Id', width:"15%", filterType:"TEXT"},
    {name:'Result', width:"", filterType:"TEXT"},
    {name: 'Owner', width:" 20%", filterType:"NONE"},
    {name: 'Start Time', width:"10%", filterType:"NONE"},
    {name: 'End Time', width:"10%", filterType:"NONE"},
    {name: 'Status', width:"10%", filterType:"NONE"}];

  }

  protected getChildrenDataList(parentId: string): JQuery.Promise<CommonData[]> {
    return getProcessList(this.appData, this.currentPageNum, this.paginationOptions.pageSize );
  }

  protected getDataList(pageNum:number): JQuery.Promise<CommonData[]> {
    let newPageNum = this.currentPageNum;
    if(pageNum>0)
      newPageNum = pageNum;
    return  getProcessList(this.appData, newPageNum, this.paginationOptions.pageSize );
  }

  protected searchDataList(filters:any): JQuery.Promise<CommonData[]> {
    return  getProcessList(this.appData, this.currentPageNum, this.paginationOptions.pageSize );
  }

  protected getTableColumnsForData(data: CommonData): string {
    let processData : ProcessData = data as ProcessData;
    return `<td>${processData.getId()}</td>`
    + `<td>${processData.resultMessage?processData.resultMessage:""}</td>`
    + `<td>${processData.owner?processData.owner:""}</td>`
    + `<td>${processData.startTime?processData.startTime:""}</td>`
    + `<td>${processData.endTime?processData.endTime:""}</td>`
    + `<td>${processData.getStatusDescription()}</td>`;
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

  
}


