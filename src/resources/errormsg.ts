const errorMessages : { [code: string] : string}  = {
    "TEXT0002" : "Il file non esiste"
}

export function decodeError(code:string): string {

    return errorMessages[code];

}
