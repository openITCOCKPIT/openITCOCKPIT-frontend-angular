import { Service, Servicetemplate, WizardGet, WizardPost } from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface ApacheTomcatWizardGet extends WizardGet {
    TOMCAT_USER: string
    TOMCAT_PW: string
    TOMCAT_PORT: number
    TOMCAT_AUTH_MODE: string
    memoryPoolServicetemplate: Servicetemplate
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
