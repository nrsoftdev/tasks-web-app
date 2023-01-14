import 'bootstrap/dist/css/bootstrap.min.css';
//import $ from "jquery";
//import "bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

import { AppWindow } from "./app";
import { getProcessList } from './procdefsvc';
import { ProcessTable } from './processtable';
import { HtmlTableOptions, HtmlTablePaginationOptions } from './htmltable';

declare let window : AppWindow;



$(
    function() {
        $("ul.navbar-nav li a").toggleClass("disabled");
        $("#status").text("Server is up and running with user " + window.application.currentUser);
        $("#userIdLabel").text("Login as: " + window.application.currentUser);

        let paginationOptions : HtmlTablePaginationOptions = { pageSize:5, nextPageId: "nextPage", previousPageId: "previousPage" };
        let options: HtmlTableOptions = { actions: false, filters: false, edit: false  };
        let table = new ProcessTable('#processTableContainer', window.application, options, paginationOptions);

        table.createTable();
        table.loadList();
        
    }
)