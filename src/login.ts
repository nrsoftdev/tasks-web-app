import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';

import { AppWindow, getStringValue } from "./app";

declare let window : AppWindow;

$(

    function() {
    $('#formLogin').on('submit', function() {
        let urlLogin = window.application.config.urlSvc + '/login';
        $.post(
            urlLogin,
            {
                "user": getStringValue($("#userId").val()),
                "password": getStringValue($("#password").val())                 
            }
        ).done(
            function(data) {
                setTimeout(
                    function() {
                        window.application.currentUser = data.userId;
                        window.application.navigateTo("home.html"); 
                    }
                ,1);
            }
        );
        return false;
    });
    }
);