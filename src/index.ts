import 'bootstrap/dist/css/bootstrap.min.css';
//import $ from "jquery";
import { Application, AppWindow } from './app';

declare let window : AppWindow;
window.application = new Application();
window.application.currentUser = "ADMIN";

$("ul.navbar-nav li").each(function() {
    $(this).on("click", function() {
        //$("#appContainer").load($(this).attr("data-page")+".html");
        window.application.navigateTo($(this).attr("data-page")+".html");
    });
});

$(function() {
    window.application.navigateTo("home.html");
});





