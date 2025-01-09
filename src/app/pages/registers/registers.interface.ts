// Get License
export interface RegistersRoot {
    hasLicense: boolean
    license: GetLicense | null
    licenseResponse: LicenseResponse | null
    isCommunityLicense: boolean
    _csrfToken: string
}

export interface GetLicense {
    id: number
    license: string
    accepted: boolean
    apt: boolean
    created: string
    modified: string
}

// Save new License
export interface LicenseResponseRoot {
    licenseResponse: LicenseResponse
    isCommunityLicense: boolean
    _csrfToken: string
}

export interface LicenseResponse {
    success: boolean
    error: any
    license: License | null
}

export interface License {
    id: number
    license: string
    firstname: string
    lastname: string
    company: string
    email: string
    max_services: number
    max_satellites: number
    expire: string
    expire_in_days: number
    modified: string
    created: string
}
