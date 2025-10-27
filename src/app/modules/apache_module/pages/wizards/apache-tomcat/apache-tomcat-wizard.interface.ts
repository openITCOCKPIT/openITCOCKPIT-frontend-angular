import { Service, WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface ApacheTomcatWizardGet extends WizardGet {
    TOMCAT_USER: string
    TOMCAT_PW: string
    TOMCAT_PORT: number
    TOMCAT_AUTH_MODE: string
}


export interface Servicecommandargumentvalue {
    commandargument: Commandargument
    commandargument_id: number
    created: string
    id: number
    modified: string
    servicetemplate_id: number
    value: string
}

export interface Commandargument {
    command_id: number
    created: string
    human_name: string
    id: number
    modified: string
    name: string
}


// WIZARD POST
export interface ApacheTomcatWizardPost extends WizardPost {
    TOMCAT_USER: string
    TOMCAT_PW: string
    TOMCAT_PORT: number
    TOMCAT_AUTH_MODE: string
    memoryPoolServices: Service[]
}


export interface ApacheTomcatMemoryPoolDiscoveryPost {
    host_id: number
}

export interface ApacheTomcatMemoryPoolDiscoveryResponse {
    memorypools: string[]
}
