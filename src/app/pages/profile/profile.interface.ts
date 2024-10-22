export interface ProfileApiRoot {
    user: ProfileUser
    isLdapUser: boolean
    maxUploadLimit: ProfileMaxUploadLimit
    newDesktopApi: boolean
    oitcVersion: string
    _csrfToken: string
}

export interface ProfileUser {
    id: number
    email: string
    firstname: string
    lastname: string
    timezone: string
    phone: string | null
    i18n: string
    dateformat: string
    samaccountname?: string | null
    showstatsinmenu: number
    paginatorlength: number
    recursive_browser: number
    image: string
    password: string | null
    confirm_password: string | null
}


export interface ProfileMaxUploadLimit {
    value: number
    unit: string
    string: string
}

export interface ProfilePasswordPost {
    current_password: string | null,
    password: string | null,
    confirm_password: string | null
}

export interface ProfileApikey {
    id: number
    userId: number
    apikey: string
    description: string
    last_use: string
}

export interface ProfileCreateApiKey {
    apikey: string
    qrcode: string
    description: string
    last_use: string | null
}
