import { Toast } from 'bootstrap';
import { decodeError } from './resources/errormsg';


export type ResponseDetail = {
	resource : string;
	responseKind: "ERROR" | "WARNING" | "INFO";
	field: string;
	code: string;
	message: string;
}


/**
 * A ".toast-container" must be defined in the host page
 * @param fieldPrefix prefix to field rrelated page control to be set as invalid
 * @param responseDetails 
 */
export function createResponseToast(fieldPrefix:string | null, responseDetails:[ResponseDetail]) {


    if(responseDetails) {
        let id=0;
        for(const itm of responseDetails) {

            let textColor = "";
            let icon = "";
            switch(itm.responseKind) {
                case "ERROR":
                    textColor = "text-danger";
                    icon="bi-exclamation-circle-fill";
                    break;
                case "WARNING":
                    textColor = "text-warning";
                    icon ='bi-exclamation-triangle-fill';
                    break;
                case "INFO":
                    textColor = "text-info";
                    icon ="bi-info-circle-fill";
                    break;

            }

            const message = decodeError(itm.code);

            id++;
            let toastHtml = `<div class="toast" role="alert" data-bs-autohide="false" aria-live="assertive" aria-atomic="true" id="toast${id}">`
            + `<div class="toast-header">`
            + `<strong class="me-auto ${textColor}"><i class="bi ${icon}"></i>&nbsp;${itm.responseKind}</strong>`
            + `<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>`
            + `</div>`
            + `<div class="toast-body">${itm.resource}.${itm.field} ${itm.message} (${itm.code})`;
            if(message) {
                toastHtml += `:<BR>` + message;
            }


            toastHtml += `</div></div>`;            

            $( ".toast-container" ).append( $( toastHtml ) );

            var toast = new Toast("#toast" + id);
            toast.show();
            if(fieldPrefix && itm.responseKind==="ERROR") $(fieldPrefix + itm.field).addClass("is-invalid");
        }
    }
}