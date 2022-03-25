import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Application, AppWindow } from '../app';



declare let window : AppWindow;

$('#btnCancel').on('click',
function() {
    window.application.clearCurrentFunction();
    window.application.sessionData.clear();
    window.application.navigateTo('processdef.html');
}
);

$('#btnNext').on('click',
    function() {
        console.log("setting "+ $('#proc-name').val() ); 
        window.application.sessionData.set("proc-name", $('#proc-name').val());
        window.application.sessionData.set("proc-descr", $('#proc-descr').val());
        if(window.application.isFunctionNew())
            window.application.navigateTo('procdefedt/task.html');
        else if(window.application.isFunctionEdit())
            window.application.navigateTo('procdefedt/var.html');
    }
);

$(
    function() {
        if(window.application.isFunctionEdit()) {
            $('#proc-name').val(window.application.sessionData.get("proc-name"));
            $('#proc-descr').val(window.application.sessionData.get("proc-descr"));
        }
    }
)
