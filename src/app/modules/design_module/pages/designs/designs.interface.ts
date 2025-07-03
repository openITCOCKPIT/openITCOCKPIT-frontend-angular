export interface DesignsEditRoot {
    design: Design
    maxUploadLimit: MaxUploadLimit
    new: boolean
    logoPdfForHtml: string,
    smallLogoPdfForHtml: string,
    logoForHtml: string,
    headerLogoForHtml: string,
    customLoginBackgroundHtml: string,
    _csrfToken: string
}

export interface Design {
    logoInHeader: number
    customcsstext: string

    // NEW FIELDZ
    rightBackground: string
    leftBackground: string
    topBackground: string
    mapBackground: string
    mapText: string
    mode: string
    modeLocked: number
}

export interface MaxUploadLimit {
    value: number
    unit: string
    string: string
}

export interface ResetLogoResponse {
    success: string
    _csrfToken: string
    message: string
}
