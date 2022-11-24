import { Toast } from 'bootstrap';
import { decodeError } from './resources/errormsg';

type ResponseKind = "ERROR" | "WARNING" | "INFO";


export type ResponseDetail = {
	resource : string;
	responseKind: ResponseKind;
	field: string;
	code: string;
	message: string;
}

function createToasts(toastsHtml: string[]) {
    toastsHtml.forEach((toastHtml:string, toastId: number) => {
        $( ".toast-container" ).append( $( toastHtml ));
        var toast = new Toast("#toast" + (toastId+1));
        toast.show();    
    
    }
    );
}

export function setInvalidFields(fieldPrefix:string, responseDetails:[ResponseDetail]) {
    let invalidFields : string[] = [];
    if(responseDetails) {
        for(const itm of responseDetails) {

            if(itm.responseKind==="ERROR")
                invalidFields.push(itm.field);        
        }
    }

    if(invalidFields!=null && invalidFields.length>0)
        for(let invalidField in invalidFields)
            $(fieldPrefix + invalidField).addClass("is-invalid");


    return invalidFields;
}

export function setErrorState(fieldPrefix:string, responseDetails:[ResponseDetail]) {
    showResponseToasts(responseDetails);
    setInvalidFields(fieldPrefix, responseDetails);
}


function getGraphicFromResponseKind(responseKind: ResponseKind) : [string, string] {
    let textColor = "";
    let icon = "";
    switch(responseKind) {
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

    return [textColor, icon];
}

function createResponseToast(toastId: number, toastBody:string, toastMessage:string, responseKind: ResponseKind) {

    let textColor = "";
    let icon = "";

    [textColor, icon] = getGraphicFromResponseKind(responseKind);

    let toastHtml = `<div class="toast" role="alert" data-bs-autohide="false" aria-live="assertive" aria-atomic="true" id="toast${toastId}">`
    + `<div class="toast-header">`
    + `<strong class="me-auto ${textColor}"><i class="bi ${icon}"></i>&nbsp;${responseKind}</strong>`
    + `<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>`
    + `</div>`
    + `<div class="toast-body">${toastBody}`;
    if(toastMessage) {
        toastHtml += `:<BR>` + toastMessage;
    }
    toastHtml += `</div></div>`;         
    return toastHtml;
}

/**
 * A ".toast-container" must be defined in the host page
 * @param fieldPrefix prefix to field related page control to be set as invalid
 * @param responseDetails 
 */
function createResponseToasts(responseDetails:[ResponseDetail]): string[] {
   
    let toastsHtml : string[] = [];

    if(responseDetails) {
        let id=0;
        for(const itm of responseDetails) {



            const message = decodeError(itm.code);

            id++;

            const body=`${itm.resource}.${itm.field} ${itm.message} (${itm.code})`;
            let toastHtml = createResponseToast(id, body, message, itm.responseKind);
            
            toastsHtml.push(toastHtml);
        }
    }


    return toastsHtml;


}


export function showResponseToasts(responseDetails:[ResponseDetail]) {

    createToasts(createResponseToasts(responseDetails));
}


export function showResponseToast(message:string, responseKind: ResponseKind) {

    createToasts([createResponseToast(1, message, "", responseKind)]);
}