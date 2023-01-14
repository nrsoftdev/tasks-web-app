const errorMessages : { [code: string] : string}  = {
    "TEXT0002" : "Il file non esiste",
    "GEN00001" : "Operazione eseguita con successo"
}

export function decodeError(code:string): string {

    return errorMessages[code];

}
