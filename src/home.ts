import 'bootstrap/dist/css/bootstrap.min.css';
//import $ from "jquery";
//import "bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Application, AppWindow } from "./app";
import { getMetadata } from './metadata/metadata';

declare let window : AppWindow;

let url = window.application.config.urlSvc + '/status';


$.ajax({
    method: 'GET',
    url: url,
    'success':function() {
        $("#status").text("Server is up and running with user " + window.application.currentUser);
        getMetadata(window.application).then(
            (value) => window.application.metadata = value
        )
    },
    'error':function() {
        $("#status").text("Server is not responding.");
    }
}

)