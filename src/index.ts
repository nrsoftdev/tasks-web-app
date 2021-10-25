import 'bootstrap/dist/css/bootstrap.min.css';
import $ from "jquery";

$(function() {
    $("#appContainer").load("home.html");
});

$("ul.navbar-nav li").each(function() {
    $(this).on("click", function() {
        $("#appContainer").load($(this).attr("data-page")+".html");
    });
});



