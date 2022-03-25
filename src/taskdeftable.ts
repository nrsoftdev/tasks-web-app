/*
<table class="table" id="taskTbl">
    <thead>
      <tr>
        <th scope="col">Select</th>
        <th scope="col"><input type="text" id="select-name"  class="form-control task-selection" placeholder="Name"></th>
        <th scope="col"><input type="text" id="select-desc"  class="form-control task-selection" placeholder="Description">
        <th scope="col">
          <select class="form-select" id="select-class">
              
            <option selected value="">Class Name</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
            
          </select>

        </th>
        <th scope="col">Has Children</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
</table>


<table class="table" id="taskTbl">
    <thead>
      <tr>
        <th scope="col">Actions</th>
        <th scope="col">Name</th>
        <th scope="col">Description</th>
        <th scope="col">Class Name</th>
        <th scope="col">Has Children</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
</table>
*/

import { ApplicationData } from "./appdata";
import { getTaskDefChildrenList, getTaskDefList, searchTaskDefList } from "./taskdefsvc";

export type TaskTablePaginationOptions = { pageSize:number, previousPageId: string, nextPageId: string};

export type TaskTableOptions = { selection?: boolean, filters?: boolean, edit?:boolean, paginationOptions? : TaskTablePaginationOptions };

export type TaskInfo = { taskId: number, name: string, description: string, className: string, children: number, allowsChildren: boolean };


export class TaskTable {
  
  OnStartNew!: (event: JQuery.ClickEvent) => void;
  OnStartSearch!: (event: JQuery.ClickEvent) => void;
  OnStartEdit!: (event: JQuery.ClickEvent) => void;
  OnStartDelete!: (event: JQuery.ClickEvent) => void;
  OnChildrenEdit!: (event: JQuery.ClickEvent) => void;
  

  private options: TaskTableOptions;
  private paginationOptions : TaskTablePaginationOptions;
  private selector: String; 

  private currentPageNum: number = 1;
  private currentPages: number = 1;
  private currentTaskId: string = "";

  navigationTrace: {taskId:string, pageNum:number}[] = [];

  lastParentTaskIdNone = -1;

  private columns = ['Actions', 'Name', 'Description', 'Class Name', 'Children'];
  appData: ApplicationData;
  listData: any;
  
  constructor(selector:string, appData: ApplicationData, options: TaskTableOptions | null = null) {

    this.selector = selector;
    this.appData = appData;
    if(options==null)
      this.options = {};
    else
      this.options = options;


    if(options?.paginationOptions!=null) {
      this.paginationOptions = options.paginationOptions;
    } else {
      this.paginationOptions = { pageSize:0, previousPageId: "", nextPageId: "" };
    }

    $(selector).append(
      '<button class="btn btn-primary" href="#" role="button" id="backBtn"><i class="bi bi-arrow-up-square-fill"></i></button>&nbsp;'
      +'<button class="btn btn-primary" href="#" role="button" id="refreshBtn"><i class="bi bi-arrow-clockwise"></i></button>&nbsp;'
      +'<button class="btn btn-primary" href="#" role="button" id="newBtn"><i class="bi bi-plus-square-fill"></i></button>&nbsp;'
      +'<button class="btn btn-primary" href="#" role="button" id="searchBtn" style="display:none"><i class="bi bi-search"></i></button>'
    );
    $("#searchBtn").after('<table class="table" id="taskTbl"><thead></thead><tbody></tbody></table>');

    $("#taskTbl").after(this.buildNavigation());

    


    $(".page-link-num").on("click", this.setCurrentPageNum.bind(this));

    $("#previousPage").on("click", this.previousPage.bind(this)  );
    
    $("#nextPage").on("click", this.nextPage.bind(this));

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

  public getCurrentTaskId(): string {
    return this.currentTaskId;
  }


  private buildNavigation(): string {
    return '<nav aria-label="Page navigation">'+
  '<ul class="pagination">'+
    '<li class="page-item">'+
      '<a class="page-link" href="#" id="previousPage" aria-label="Previous">'+
        '<span aria-hidden="true">&laquo;</span>'+
      '</a>'+
    '</li>'+
    '<li id="page-item-1" class="page-item page-item-last"><a class="page-link page-link-num" href="#" data-pageNum="1">1</a></li>'+
    '<li class="page-item">'+
      '<a class="page-link" href="#" id="nextPage" aria-label="Next">'+
        '<span aria-hidden="true">&raquo;</span>'+
      '</a>'+
    '</li>'+
  '</ul>'+
'</nav>'+
'</div>';
  }


  public loadList() {
    this.empty();

    const me = this;

    getTaskDefList(this.appData, this.currentPageNum, this.paginationOptions.pageSize)
    .then(
        function(data:any) {
          me.data(data);
        }
    );
  }



  loadListSearch(name: string, description: string, className: string) {
    this.empty();

    const me = this;

    let filters:any = {};
    if(name.length>0) filters.name = name;
    if(description.length>0) filters.description = description;
    if(className.length>0) filters.className = className;
    searchTaskDefList(this.appData, filters, this.currentPageNum, this.paginationOptions.pageSize)
    .then(
      function(data:any) {
        me.data(data);
      }
  );

  }


  public async getListData(pageNum: number) {
    const me = this;
    this.listData = [];
    return getTaskDefList(this.appData, pageNum, this.paginationOptions.pageSize)
    .then(
        function(data:any) {
          me.listData = data;
        }
    );
  }


  public createTable() {
   
    if(this.options?.selection) {
      this.columns[0] = "Select";
    }


    for(const column of this.columns)
      $(this.selector).children('thead').append(`<th scope="col">${this.getColumnHeader(column)}</th>`);
  }

  private getColumnHeader(column: string) {


    if(this.options?.filters) {
        if(column == "Name" || column=="Description")
            return `<input type="text" id="select-${column.toLowerCase()}"  class="form-control task-selection" placeholder="${column}">`

        if(column == "Class Name")
          return `<select class="form-select" id="select-class"><option selected value="">Class Name</option></select>`;
        
    }
    return column;
  }

  public empty() {
    $(this.selector).find('tbody').empty();
  }

  public data(data: [TaskInfo]) {
    for(let i=0;i<data.length;i++) {
      let row = `<tr><th scope="row">`;

      if(this.options.selection) {
        row += `<input class="form-check-input" type="radio" name="taskSelect" value="${data[i].taskId}">`;
      } else {
        row += `<a class="btn btn-primary start-edit" role="button" href='#' data-taskId="${data[i].taskId}"><i class="bi bi-pencil-square"></i></a>&nbsp;`;
        let addDeleteBtn = true;
        let btnClass = "btn-primary";
        if(this.currentTaskId.length>0)
          btnClass = "btn-secondary"
        if(data[i].allowsChildren) {
          addDeleteBtn = data[i].children==0;
        }
        if(addDeleteBtn)
          row += `<a class="btn ${btnClass} start-delete" role="button" href='#' data-taskId="${data[i].taskId}"><i class="bi bi-trash-fill"></i></a>`;

      }
      row += "</th>"
      + `<td>${data[i].name}</td><td>${data[i].description?data[i].description:""}</td>`
      + `<td>${data[i].className?data[i].className:""}</td>`
      + `<td>${data[i].allowsChildren?`<a class="btn btn-primary start-children" data-taskId="${data[i].taskId}" role="button" href="#"><i class="bi bi-three-dots"></i></a>`:""}</td>`
      + "</tr>";


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
  }

  private loadChildrenList(event: JQuery.ClickEvent) {
    const me=this;
    this.empty();
    const taskId = String($(event.currentTarget).data("taskid"));

    this.navigationTrace.push({taskId:this.currentTaskId, pageNum:this.currentPageNum});
    
    this.currentTaskId = taskId;
    this.currentPageNum = 0;
    $("#searchBtn").show();
    getTaskDefChildrenList(this.appData, taskId, this.currentPageNum, this.paginationOptions.pageSize )
    .then(
      function(data:any) {
        me.data(data);
      });
  }

  private loadChildrenListBack(event: JQuery.ClickEvent) {
    const me=this;


    const navigation = this.navigationTrace.pop();
    if(navigation==undefined) return;
    this.empty();
    if(navigation.taskId.length===0) {
      this.currentTaskId = "";
      this.currentPageNum =navigation.pageNum;
      $("#searchBtn").hide();
      getTaskDefList(this.appData, this.currentPageNum, this.paginationOptions.pageSize )
      .then(
        function(data:any) {
          me.data(data);
        });

    } else {

      const taskId = navigation.taskId;
      
      this.currentTaskId = taskId;
      this.currentPageNum = navigation.pageNum;
      getTaskDefChildrenList(this.appData, taskId, this.currentPageNum, this.paginationOptions.pageSize )
      .then(
        function(data:any) {
          me.data(data);
        });
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

  private async nextPage(event: JQuery.ClickEvent) {




    if(this.currentPageNum<this.currentPages) {
      
      $(`#page-item-${this.currentPageNum}`).removeClass("active");
      this.currentPageNum++;
      $(`#page-item-${this.currentPageNum}`).addClass("active");
      this.loadList();
    } else {


      const nextPageNum = this.currentPageNum+1;
      await this.getListData(nextPageNum);
      if( this.listData.length>0 ) {
        
        this.currentPageNum = nextPageNum;
          this.currentPages++;
          const last = $(".page-item-last");
          const node = $(`<li id="page-item-${this.currentPageNum}" class="page-item active page-item-last"><a class="page-link page-link-num" href="#" data-pageNum="${this.currentPageNum}">${this.currentPageNum}</a></li>`); 
          $(".page-item-last").after(node);
          last.removeClass("page-item-last");
          last.removeClass("active");
    
          node.children(".page-link-num").on("click", this.setCurrentPageNum.bind(this) );
          this.empty();
          this.data(this.listData);  
      }
    }
  }  
  
}

function pageNum(appData: ApplicationData, taskId: string, pageNum: any, pageSize: number) {
  throw new Error("Function not implemented.");
}

