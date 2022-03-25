import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Application, AppWindow, getStringValue } from '../app';

declare let window : AppWindow;



$('#btnCancel').on('click',
function() {
    window.application.clearCurrentFunction();
    window.application.sessionData.clear();
    window.application.navigateTo('taskdef.html');
}
);

$('#btnNext').on('click',
function() {

    const className = getStringValue($("#select-class").val());
    window.application.sessionData.set("className", className);
    window.application.navigateTo('taskdefedt/basic.html');
    
});


async function loadClassNameChoice() {

    //select-text-conn
    $('#select-class').empty();
    $('#select-class').append("<option selected>Select a class</option>");

    const metadata = window.application.metadata;
    for(let className in metadata) {

        $('#select-class').append($('<option>', {
            value: metadata[className].className,
            text: metadata[className].name + " - " + metadata[className].description
        }));
    }
}

$(

    async function() {
        await loadClassNameChoice();
    }
)