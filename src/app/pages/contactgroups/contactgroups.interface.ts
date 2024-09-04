import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { GenericValidationError } from '../../generic-responses';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';

export interface ContactgroupsIndexParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc

    'filter[Contactgroups.id][]': number[],
    'filter[Contactgroups.description]': string,
    'filter[Containers.name]': string,
}

export function getDefaultContactgroupsIndexParams(): ContactgroupsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Containers.name',
        page: 1,
        direction: 'asc',
        'filter[Contactgroups.id][]': [],
        'filter[Contactgroups.description]': "",
        'filter[Containers.name]': ""
    }
}

/************************************
 *    Definition of Contactgroup    *
 ***********************************/
export interface ContactgroupEditPost {
    Contactgroup: ContactgroupEditContactGroup
}

export interface ContactgroupEditContactGroup {
    contacts: Contacts
    container: Container
    container_id: number
    description: string
    id: number
    uuid: string
}

export interface Contacts {
    _ids: number[]
}

export interface ContactgroupsIndexRoot extends PaginateOrScroll {
    all_contactgroups: ContactgroupsIndex[]
    _csrfToken: string
}

export interface ContactgroupsIndex {
    Contactgroup: ContactgroupsIndexContactgroup
    Container: ContactgroupsIndexContainer
}

export interface ContactgroupsIndexContactgroup {
    id: number
    uuid: string
    container_id: number
    description: string
    allow_edit: boolean
    contact_count: number
}

export interface ContactgroupsIndexContainer {
    id: number
    containertype_id: number
    name: string
    parent_id: number
    lft: number
    rght: number
}

// EDIT (GET)
export interface ContactgroupsEditRoot {
    contactgroup: ContactgroupEdit
}

export interface ContactgroupEdit {
    Contactgroup: ContactgroupEditPostContactgroup
}


export interface Contacts {
    _ids: number[]
}

export interface Container {
    id: number
    containertype_id: number
    name: string
    parent_id: number | null
    lft: number
    rght: number
}


// EDIT (POST)
export interface ContactgroupEditPostContactgroup {
    contacts: ContactgroupPostContactgroupContacts
    container: {
        containertype_id: number
        id: number
        lft: number
        name: string
        parent_id: number
        rght: number
    }
    container_id: number
    description: string
    id: number
    uuid: string
}

export interface ContactgroupAddPostContactgroup {
    contacts: ContactgroupPostContactgroupContacts
    container: {
        name: string
        parent_id: number | null
    }
    description: string
}

export interface ContactgroupPostContactgroupContacts {
    _ids: number[]
}

// COPY (GET)
export interface ContactgroupsCopyGet {
    contactgroups: ContactgroupsCopyGetContactgroup[]
    _csrfToken: string
}

export interface ContactgroupsCopyGetContactgroup {
    Contactgroup: {
        id: number
        description: string
        container_id: number
    }
    Container: {
        id: number
        name: string
    }
}

export interface ContactgroupsCopyPost {
    Contactgroup: {
        container: {
            name: string
        }
        description: string
    }
    Source: {
        id: number
        name: string
    }
    Error: GenericValidationError | null
}


// USED BY
export interface ContactgroupsUsedByRoot {
    total: number;
    contactgroupWithRelations: ContactgroupUsedByObjects
    _csrfToken: string
}

export interface ContactgroupUsedByObjects {
    id: number
    uuid: string
    container_id: number
    description: string
    serviceescalations: {
        id: number
        _joinData: {
            id: number
            contactgroup_id: number
            serviceescalation_id: number
        }
        ContactgroupsToServiceescalations: {
            contactgroup_id: number
        }
    }[]
    hostescalations: {
        id: number
        _joinData: {
            id: number
            contactgroup_id: number
            hostescalation_id: number
        }
        ContactgroupsToHostescalations: {
            contactgroup_id: number
        }
    }[]
    services: {
        id: number
        name: string
        ContactgroupsToServices: {
            contactgroup_id: number
        }
    }[]
    servicetemplates: {
        id: number
        name: string
        ContactgroupsToServicetemplates: {
            contactgroup_id: number
        }
    }[]
    hosts: {
        id: number
        name: string
        address: string
        ContactgroupsToHosts: {
            contactgroup_id: number
        }
    }[]
    hosttemplates: {
        id: number
        name: string
        ContactgroupsToHosttemplates: {
            contactgroup_id: number
        }
    }[]
    container: ContactgroupsUsedByRootContainer
}

export interface ContactgroupsUsedByRootContainer {
    name: string
}


// GET CONTACTS BY CONTAINER
export interface GetContactsByContainerIdRoot {
    contacts: SelectKeyValue[]
    _csrfToken: string
}

/*********************************
 *    Definition of Container    *
 *********************************/
export interface LoadContainersRoot {
    containers: SelectKeyValue[]
    _csrfToken: string
}


/**********************
 *    Hosts Browser   *
 **********************/

export interface ContactgroupEntity {
    id: number
    uuid: string
    container_id: number
    description: string
    _joinData: {
        id: number
        contactgroup_id: number
        hosttemplate_id: number
    }
    container: Container,
    allowEdit?: boolean
}
