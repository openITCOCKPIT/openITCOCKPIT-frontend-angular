import { IconProp } from '@fortawesome/fontawesome-svg-core';

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

export interface DocumentationWikiRootResponse {
    documentations: {
        additional_help: {
            name: string
            directory: string
            children: {
                [key: string]: {
                    name: string
                    description: string
                    file: string
                    icon: IconProp
                }
            }
        }
    }
    _csrfToken: string
}

export interface DocumentationWikiRecord {
    name: string
    description: string
    file: string
    icon: IconProp
}

export interface DocumentationWikiRecordResponse {
    documentation: {
        name: string
        description: string
        file: string
        icon: IconProp
    }
    html: string
    _csrfToken: string
}
