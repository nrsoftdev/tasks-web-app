import { Application, getStringValue } from "./app";
import { CommonData } from "./appdata";

export type HtmlTablePaginationOptions = { pageSize:number, previousPageId: string, nextPageId: string};

export const REFRESH_BTN_NAME= "REFRESH_BTN";
const REFRESH_BTN_DEF = { id: "refreshBtn", initialDisplay: "", icon: "bi-arrow-clockwise"};
export const STANDARD_BTN_DEFS = {
  "REFRESH_BTN" : REFRESH_BTN_DEF
}

export class ActionButttonDefinition {
  public id: string="";
  public classDef: string="";
  public icon: string="";

  constructor(id: string, classDef: string, icon: string) {
    this.id = id;
    this.icon = icon;
    this.classDef = classDef;
  }
}

export type HtmlTableOptions = { 
  actions?: boolean /** First column is "Actions" */
  , selection?: boolean /** First column is "Selection" */
  , childrenNavigation? : boolean
  , filters?: boolean /** Filters on columns heading */
  , edit?:boolean
 };


export type ToolbarButton = { id: string, icon: string, initialDisplay: string };
export type ColumnFilterType = "NONE"|"SELECT"|"TEXT";
export type ColumnInfoType= {name: string, width: string, filterType: ColumnFilterType};

const COLUMN_NAME_SELECTION = "Select";

const PAGINATION_NAVIGATOR_HTML =
`<nav aria-label="Page navigation">
<ul class="pagination">
  <li class="page-item">
    <a class="page-link" href="#" id="previousPage" aria-label="Previous">
      <span aria-hidden="true">&laquo;</span>
    </a>
  </li>
  <li id="page-item-1" class="page-item page-item-last">
    <a class="page-link page-link-num" href="#" data-pageNum="1">1</a>
  </li>
  <li class="page-item">
    <a class="page-link" href="#" id="nextPage" aria-label="Next">
      <span aria-hidden="true">&raquo;</span>
    </a>
  </li>
</ul>
</nav>`;


export abstract class HtmlTable {

  //#region Event Handlers
  OnStartNew!: (event: JQuery.ClickEvent) => void;
  OnStartSearch!: (event: JQuery.ClickEvent) => void;
  OnStartEdit!: (event: JQuery.ClickEvent) => void;
  OnStartDelete!: (event: JQuery.ClickEvent) => void;
  OnChildrenEdit!: (event: JQuery.ClickEvent) => void;
  OnStartConfirm!: (event: JQuery.ClickEvent) => void;
  OnStartCancel!: (event: JQuery.ClickEvent) => void;
  //#region 
  
  /* Options */
  protected options: HtmlTableOptions;
  protected paginationOptions : HtmlTablePaginationOptions;
  
  /** Selector for jQuery */
  protected selector: String; 
  /** Base id for other DOM object ids (e.g. 'task' for a grid on tasks)*/
  protected idBase = "";

  /* Pagination */
  protected currentPageNum: number = 1;
  protected currentPages: number = 1;
  protected navigationCurrentId: string = "";
  protected navigationTrace: {navigationItemId:string, pageNum:number}[] = [];

  protected columnsInfo : ColumnInfoType  [] = []; 

  /** Defalt buttons */
  protected toolbarButtons : ToolbarButton[] = [];

  protected appData: Application;
  
  
  constructor(selector:string
    , idBase: string
    , appData: Application
    , options: HtmlTableOptions | null = null
    , paginationOptions: HtmlTablePaginationOptions | null = null
    , toolbarButtons : ToolbarButton[]) {

    this.toolbarButtons = toolbarButtons; 

    
    this.appData = appData;
    this.idBase = idBase;
    if(options==null)
      this.options = {};
    else
      this.options = options;


    if(paginationOptions==null) {
      this.paginationOptions = { pageSize:0, previousPageId: "", nextPageId: "" }; ;
    } else {
      this.paginationOptions = paginationOptions;
    }

    let toolbarHtml = '<div id="tblToolbar" class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">';
    for(let toolbarButton of this.toolbarButtons)
      toolbarHtml += '<button class="btn btn-primary" href="#" role="button" id="' + toolbarButton.id + "\" "
                  + (toolbarButton.initialDisplay.length>0? 'style="display:' + toolbarButton.initialDisplay + '\"': "")
                  + '>'
                  + '<i class="bi ' + toolbarButton.icon + '"></i></button>&nbsp;';

    toolbarHtml += '</div>'

    $(selector).append(toolbarHtml);

    $("#tblToolbar").after(`<table class="table" id="${idBase}Tbl"><thead></thead><tbody></tbody></table>`);
    $(`#${idBase}Tbl`).after(`<div id="navigationContainer">`)

    this.rebuildPaginationElement();

    this.selector = "#" + idBase +"Tbl";

    $(selector).append(`<div id="spinner1" class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>`);

    if(!options?.actions) {
      $('#confirmBtn').show();
      $('#cancelBtn').show();
    }
    
    $(".page-link-num").on("click", this.setCurrentPageNum.bind(this));



    $('#backBtn').on("click",         
      (event: JQuery.ClickEvent) =>
        this.loadChildrenListBack(event));
  }

  public setOnStartEdit(OnStartEdit: (event: JQuery.ClickEvent) => void) {
    this.OnStartEdit = OnStartEdit;
  }

  public setOnStartDelete(OnStartDelete: (event: JQuery.ClickEvent) => void) {
    this.OnStartDelete = OnStartDelete;
  }

  public setOnStartConfirm(OnStartConfirm: (event: JQuery.ClickEvent) => void) {
    this.OnStartConfirm = OnStartConfirm;
  }

  public setOnStartCancel(OnStartCancel: (event: JQuery.ClickEvent) => void) {
    this.OnStartCancel = OnStartCancel;
  }  

  public setOnChildrenEdit(OnChildrenEdit: (event: JQuery.ClickEvent) => void) {
    this.OnChildrenEdit = OnChildrenEdit;
  }  

  public setOnStartNew(OnStartNew: (event: JQuery.ClickEvent) => void) {
    this.OnStartNew = OnStartNew;
    $('#newBtn').on("click", this.OnStartNew);
  } 

  public setOnStartSearch(OnStartSearch: (event: JQuery.ClickEvent) => void) {
    this.OnStartSearch = OnStartSearch;
    $('#searchBtn').on("click", this.OnStartSearch);
  } 

  public getNavigationCurrentId(): string {
    return this.navigationCurrentId;
  }

  public getCurrentSelectedId(): string {
    return getStringValue($("input[name='itemSelect']:checked").val());
  }

  /* Data retrieval methods */
  protected abstract getDataList(pageNum: number) : JQuery.Promise<CommonData[]>;
  protected abstract getChildrenDataList( parentId: string) : JQuery.Promise<CommonData[]>;  
  protected abstract searchDataList(filters:any): JQuery.Promise<CommonData[]>;

  protected abstract getColumnHeader(column: ColumnInfoType): string;
  protected abstract getColumnFilters(): any;   
  protected abstract getTableColumnsForData(data: CommonData): string;  

  public empty() {
    $(this.selector).find('tbody').empty();
  }  

  public isPaginating() : boolean {
    return this.paginationOptions.pageSize>0;
  }

  /* Call getDataList */
  public loadList() {
    $("#spinner1").show();
    this.empty();

    const me = this;

    this.getDataList(this.currentPageNum)
    .then(
        function(data:CommonData[]) {
          me.data(data);
          $("#spinner1").hide();
        }
    );
  }
  
  /* Call searchDataList */
  public loadListSearch(filters:any) {
    this.empty();
    this.searchDataList(filters).then(this.data.bind(this));
  }

  /**
   * Must be called after initialization and setup of event handlers
   */
  public createTable() {
   
    if(this.options?.selection) {
      this.columnsInfo[0].name = COLUMN_NAME_SELECTION;
    }


    for(const column of this.columnsInfo) {
      let width = column.width;
      if(width!=="") {
        width = ' style="width:'+ width +'"';
      }
      $(this.selector).children('thead').append(`<th scope="col"${width}>${this.getColumnHeader(column)}</th>`);
    }

    let me = this;
    $('.select-filter-change').on('change', function (this) {

      me.loadListSearch( me.getColumnFilters() );
    });


    $(".text-filter-change").on("keypress",
      function(e) {
        if(e.key=="Enter") {

        me.loadListSearch( me.getColumnFilters() );
        }

    });

    $('#confirmBtn').on('click', this.OnStartConfirm);
    $('#cancelBtn').on('click', this.OnStartCancel);
  
  }

  /**
   * Add all data to grid
   * @param data list of CommonData
   */
  private data(data: CommonData[]) {
    
    for(let i=0;i<data.length;i++) {
      let row = "<tr>";
      let firstColumn ="";
      if(this.options?.actions) {
        firstColumn = this.buildActionRowButtons(data[i]);
      } else if(this.options?.selection) {
        firstColumn = `<input class="form-check-input" type="radio" name="itemSelect" value="${data[i].getId()}">`;
      }
      if(firstColumn.length>0) {
        row += `<th scope="row">${firstColumn}</th>`;
      }
      row += this.getTableColumnsForData(data[i]) + "</tr>";


      $(this.selector).find('tbody').append(row);
    }
    $('.start-edit').on("click", this.OnStartEdit);
    $('.start-delete').on("click", this.OnStartDelete);

    if(this.options.edit)
      $('.start-children').on("click", this.OnChildrenEdit);
    else
      $('.start-children').on("click", 
        (event: JQuery.ClickEvent) =>
          this.loadChildrenList(event));

    this.setupCustomActions();
          
  }
  protected setupCustomActions() : void {
    
  }

  protected abstract buildActionRowButtonDefs(data:CommonData): ActionButttonDefinition[];


  protected buildActionRowButtons(data:CommonData): string {

    let row: string="";
    let actionButttonDefinitions = this.buildActionRowButtonDefs(data);
    for(let actionButttonDefinition of actionButttonDefinitions) {
      row += `<a class="${actionButttonDefinition?.classDef}" role="button" href='#' data-itemId="${actionButttonDefinition?.id}"><i class="bi ${actionButttonDefinition?.icon}"></i></a>`;
    }
    return row;
  }

  private loadChildrenList(event: JQuery.ClickEvent) {
    const me=this;
    this.empty();
    this.rebuildPaginationElement();
    const itemId = String($(event.currentTarget).data("itemid"));

    this.navigationTrace.push({navigationItemId:this.navigationCurrentId, pageNum:this.currentPageNum});
    
    this.navigationCurrentId = itemId;
    this.currentPageNum = 0;
    $("#searchBtn").show();

    this.getChildrenDataList(itemId).then(this.data.bind(this));
  }

  private rebuildPaginationElement(): void {
    if(!this.isPaginating())
      return;

    $("#navigationContainer").empty();
    $("#navigationContainer").html(PAGINATION_NAVIGATOR_HTML);
    $("#previousPage").on("click", this.previousPage.bind(this));
    $("#nextPage").on("click", this.nextPage.bind(this));
  }

  private loadChildrenListBack(event: JQuery.ClickEvent) {


    const navigation = this.navigationTrace.pop();
    if(navigation==undefined) return;
    this.empty();
    this.rebuildPaginationElement();

    if(navigation.pageNum>1)
    for(let newPageNum=2;newPageNum<=navigation.pageNum;newPageNum++)
      this.addPageToNavigator(newPageNum);
    this.currentPageNum =navigation.pageNum;
    // Root, torno alla gestione normale
    if(navigation.navigationItemId.length===0) {
      this.navigationCurrentId = "";
      
      //this.setCurrentPageNum()
      $("#searchBtn").hide();
      this.getDataList(this.currentPageNum)
      .then(this.data.bind(this));
    } else {
      const itemId = navigation.navigationItemId;
      this.navigationCurrentId = itemId;
      this.getChildrenDataList( itemId )
      .then(
        this.data.bind(this)
      );
    }
  }

  private setCurrentPageNum(event: JQuery.ClickEvent) {

    $(`#page-item-${this.currentPageNum}`).removeClass("active");

    this.currentPageNum = Number($(event.target).data("pagenum"));
    $(`#page-item-${this.currentPageNum}`).addClass("active");
    this.loadList();
  }

  private previousPage(event: JQuery.ClickEvent) {
      if(this.currentPageNum>1) {

          $(`#page-item-${this.currentPageNum}`).removeClass("active");
          this.currentPageNum--;
          $(`#page-item-${this.currentPageNum}`).addClass("active");
          this.loadList();
      }
  
  }

  private addPageToNavigator(pageNum: number): void {
    const last = $(".page-item-last");
    const node = $(`<li id="page-item-${pageNum}" class="page-item active page-item-last"><a class="page-link page-link-num" href="#" data-pageNum="${pageNum}">${pageNum}</a></li>`); 
    $(".page-item-last").after(node);
    last.removeClass("page-item-last");
    last.removeClass("active");
    node.children(".page-link-num").on("click", this.setCurrentPageNum.bind(this) );
  }

  private async nextPage(event: JQuery.ClickEvent) {

    if(this.currentPageNum<this.currentPages) {
      
      $(`#page-item-${this.currentPageNum}`).removeClass("active");
      this.currentPageNum++;
      $(`#page-item-${this.currentPageNum}`).addClass("active");
      this.loadList();
    } else {


      const nextPageNum = this.currentPageNum+1;

      let listData = await this.getDataList(nextPageNum);


      if( listData.length>0 ) {
        
        this.currentPageNum = nextPageNum;
        this.currentPages++;

        this.addPageToNavigator(this.currentPageNum);
  
        
        
        this.empty();
        this.data(listData);  
      }
    }
  }  
  
}



