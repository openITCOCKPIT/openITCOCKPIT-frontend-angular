export interface PacketmanagerIndexRoot {
    result: {
        error: boolean
        error_msg: string
        data: {
            modules: PacketmanagerModule[]
            changelog: PacketmanagerChangelog[]
            isDebianBased: boolean
            isRhelBased: boolean
            isContainer: boolean
            codename: string
            systemname: string
            newVersion: boolean
            version: string
            logoURL: string
            _csrfToken: string
        }
    }
    installedModules: {
        [key: string]:
            boolean
    }

    OPENITCOCKPIT_VERSION: string
    _csrfToken: string
}


export interface PacketmanagerModule {
    Module: {
        id: any
        name: string
        apt_name: string
        description: string
        author: string
        enterprise: boolean
        license?: string
        modified: string
        created: string
        license_included?: boolean
        tags: string[] | string
        url: string
        module_license?: {
            name: string
        }
    }
}

export interface PacketmanagerChangelog {
    Changelog: {
        id: number
        major_version: string
        version: string
        changes: string
    }
}