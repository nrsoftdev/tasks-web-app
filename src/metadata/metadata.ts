import { Application } from "../app";

export type MetadataInfo = {className:string, connectorType:string, name: string, description: string, allowsChildren:boolean};


export type Metadata = { [className: string] : MetadataInfo};


export type ClassMetadataProperty = {
    connector: boolean,
    defaultValue: string,
    description: string,
    maxLen: number,
    minLen: number,
    name: string,
    optional: boolean,
    pattern: string,
    propertyType: string,
    choiceValues: string[]
};

export type ClassMetadata = { [propertyName: string] : ClassMetadataProperty;}




export async function  getMetadata(appData : Application): Promise<Metadata> {

    return $.get( 
        appData.config.urlSvc + "/md"
    ).then(
        function(data) {
            return extracMetadata(data);
        }
    );
}


function extracMetadata(data:any): Metadata {

    let metadata : { [className: string] : MetadataInfo} = {}

    for(let i=0;i<data.length;i++) {

        metadata[data[i].className] = data[i];
    }

    return metadata;
}

export async function getClassMetadata(appData : Application, className: string): Promise<ClassMetadata> {
    return $.ajax({
        'method': 'GET',
        'url': appData.config.urlSvc + "/md/" + className,
    }).then(
        function(data) {
            return data;
        }
    );

}

