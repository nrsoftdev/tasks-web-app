import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';

import { Application, AppWindow } from "./app";

declare let window : AppWindow;

$(
    function() {
    $('#formLogin').on('submit', function() {
        $("ul.navbar-nav li a").toggleClass("disabled");
        window.application.navigateTo("home.html");
        return true;
    });
    }
);