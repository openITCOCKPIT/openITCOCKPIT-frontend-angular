import {
    ServiceForWizard,
    ServicetemplateForWizard,
    WizardGet,
    WizardPost
} from '../../../../../pages/wizards/wizards.interface';

// WIZARD GET
export interface KubernetesEndpointWizardGet extends WizardGet {
    K8S_PORT: number
    TOKEN_FILE_PATH: string
    TOKEN_FILE_EXISTS: boolean
    endpointServicetemplate: ServicetemplateForWizard
}

// WIZARD POST
export interface KubernetesEndpointsWizardPost extends WizardPost {
    host_id: number
    endpointservices: ServiceForWizard[]
    TOKEN_FILE_PATH: string
    TOKEN_FILE_EXISTS: boolean
    K8S_PORT: number
}

export interface EndpointDiscovery {
}
