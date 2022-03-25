import { Toast } from 'bootstrap';
export function createErrorToast(fieldPrefix:string, responseDetails:[any]) {


    if(responseDetails) {
        let id=0;
        for(const itm of responseDetails) {

            id++;
            const toastHtml = `<div class="toast" role="alert" data-bs-autohide="false" aria-live="assertive" aria-atomic="true" id="toast${id}">`
            + `<div class="toast-header">`
            + `<strong class="me-auto text-danger"><i class="bi bi-exclamation-circle-fill"></i>&nbsp;${itm.responseKind}</strong>`
            + `<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>`
            + `</div>`
            + `<div class="toast-body">${itm.resource}.${itm.field} ${itm.message} (${itm.code})</div>`
            + `</div>`;            

            $( ".toast-container" ).append( $( toastHtml ) );

            var toast = new Toast("#toast" + id);
            toast.show();
            $(fieldPrefix + itm.field).addClass("is-invalid");
        }
    }
}