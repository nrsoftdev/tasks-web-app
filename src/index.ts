import 'bootstrap/dist/css/bootstrap.min.css';
//import $ from "jquery";
import { Application, AppWindow } from './app';
import { getMetadata } from './metadata/metadata';
import { getProcessList } from './procdefsvc';

declare let window : AppWindow;
window.application = new Application();


let url = window.application.config.urlSvc + '/status';

$("ul.navbar-nav li").each(function() {
    $(this).on("click", function() {
        window.application.navigateTo($(this).attr("data-page")+".html");
    });
});

getMetadata(window.application);

$.ajax({
    method: 'GET',
    url: url,
    statusCode : {
        401: function(response) {
            window.application.navigateTo("login.html");
        }
    },
    'success':function(data) {
        $("#status").text("Server is up and running with user " + data.userId);
        $("#userIdLabel").text("Login as: " + data.userId);
        window.application.currentUser = data.userId;
        window.application.navigateTo("home.html");
    },
    'error':function() {
        $("#status").text("Server is not responding.");
    }
});






