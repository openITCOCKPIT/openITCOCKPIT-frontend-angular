export interface DocumentationView {
    lastUpdate: string
    allowEdit: boolean
    docuExists: boolean
    bbcode: string
    objectId: number
    objectName: string //Only for type host template and service template
    _csrfToken: string
}

export interface DocumentationLink {
    url: string,
    targetBlank: boolean,
}
