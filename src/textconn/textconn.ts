import 'bootstrap/dist/css/bootstrap.min.css';
//import $ from "jquery";
// import "bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Application, AppWindow, getStringValue } from "../app";
import * as connsvc  from '../connsvc';
import { TextConnData } from '../appdata';
import { setErrorState, showResponseToastMessage } from '../errormng';
import { HtmlTableOptions, HtmlTablePaginationOptions } from '../htmltable';
import { TextConnTable } from './textconntable';



declare let window : AppWindow;
let application = window.application;

let paginationOptions : HtmlTablePaginationOptions = { pageSize:5, nextPageId: "nextPage", previousPageId: "previousPage" };
let options: HtmlTableOptions = { actions: true, filters: true  };
let table = new TextConnTable('#textConnTableContainer', window.application, options, paginationOptions);

table.createTable();

table.setOnStartEdit(OnStartEdit.bind(this));
table.setOnStartNew(OnStartNew.bind(this));
table.setOnStartDelete(OnStartDelete.bind(this));
table.setOnStartCheck(OnStartCheck.bind(this));


table.loadList();

function OnStartNew(event: JQuery.ClickEvent) {
    application.setApplicationData(new TextConnData());
    application.setFunctionNew();
    
    setTimeout(
        function() { window.application.navigateTo("textconnedt.html");},
        1);
}

function OnStartEdit(event: JQuery.ClickEvent) {

    window.application.setFunctionEdit();
    window.application.currentId= getStringValue($(event.currentTarget).data("itemid")); 
    setTimeout(
        function() { window.application.navigateTo("textconnedt.html");},
        1);

}

function OnStartDelete(event: JQuery.ClickEvent) {
    window.application.setFunctionDelete();
    window.application.currentId= getStringValue($(event.currentTarget).data("itemid")); 
    setTimeout(
        function() { window.application.navigateTo("textconnedt.html");},
        1);

}


function OnStartCheck(event: JQuery.ClickEvent): void {
    const connId = getStringValue($(event.currentTarget).data("itemid")); 
    const data : TextConnData = application.getApplicationData() as TextConnData;
    connsvc.getTextConn(application, connId)
        .then(
            function(data) {
                return connsvc.checkTextConn(application, data);
            }
        ).then(
            function(responseData, status) {
                if(typeof responseData === "object") {
                    setErrorState("", responseData.responseDetails )
                } else if(typeof responseData === "string" && responseData==="") {
                    showResponseToastMessage("Test successfull", "INFO");
                }

            }
        );

}