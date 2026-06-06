import {
    ServiceForWizard,
    ServicetemplateForWizard,
    WizardGet,
    WizardPost
} from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface ApacheTomcatWizardGet extends WizardGet {
    TOMCAT_USER: string
    TOMCAT_PW: string
    TOMCAT_PORT: number
    TOMCAT_AUTH_MODE: string
    memoryPoolServicetemplate: ServicetemplateForWizard
}


// WIZARD POST
export interface ApacheTomcatWizardPost extends WizardPost {
    TOMCAT_USER: string
    TOMCAT_PW: string
    TOMCAT_PORT: number
    TOMCAT_AUTH_MODE: string
    memoryPoolServices: ServiceForWizard[]
}


export interface ApacheTomcatMemoryPoolDiscoveryPost {
    host_id: number
}

export interface ApacheTomcatMemoryPoolDiscoveryResponse {
    memorypools: string[]
}
