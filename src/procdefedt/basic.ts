import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Application, AppWindow, getStringValue } from '../app';
import { ProcessDefData } from '../appdata';



declare let window : AppWindow;

$('#btnCancel').on('click',
function() {
    window.application.clearCurrentFunction();
    window.application.clearApplicationData();
    window.application.navigateTo('processdef.html');
}
);

$('#btnNext').on('click',
    function() {
        let processDefData : ProcessDefData = new ProcessDefData();
        if(window.application.isFunctionNew()) {
            window.application.setApplicationData(processDefData);
        } else if(window.application.isFunctionEdit()) {
            processDefData = window.application.getApplicationData() as ProcessDefData;;
        }

        
        processDefData.name = getStringValue( $('#proc-name').val());
        processDefData.description = getStringValue( $('#proc-descr').val());
        if(window.application.isFunctionNew())
            window.application.navigateTo('procdefedt/task.html');
        else if(window.application.isFunctionEdit())
            window.application.navigateTo('procdefedt/var.html');
    }
);

$(
    function() {
        if(window.application.isFunctionEdit()) {
            let processDefData = window.application.getApplicationData() as ProcessDefData;;
            $('#proc-name').val(processDefData.name);
            $('#proc-descr').val(processDefData.description);
        }
    }
)
