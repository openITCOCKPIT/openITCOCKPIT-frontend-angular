import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { GenericValidationError } from '../../generic-responses';

export interface ContactgroupsIndexParams {
    // Same again? Maybe create an intermediate class? OOP FTW :-P
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc

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
export interface ContactgroupAddPost {
    Contactgroup: ContactgroupEditPostContactgroup
}

export interface ContactgroupEditPostContactgroup {
    contacts: ContactgroupPostContactgroupContacts
    container: ContactgroupEditPostContactgroupContainer
    container_id: number
    description: string
    id: number
    uuid: string
}

export interface ContactgroupAddPostContactgroup {
    contacts: ContactgroupPostContactgroupContacts
    container: ContactgroupAddPostContactgroupContainer
    description: string
}

export interface ContactgroupAddPostContactgroupContainer {
    name: string
    parent_id: number | null
}

export interface ContactgroupPostContactgroupContacts {
    _ids: number[]
}

export interface ContactgroupEditPostContactgroupContainer {
    containertype_id: number
    id: number
    lft: number
    name: string
    parent_id: number
    rght: number
}

// COPY (GET)
export interface ContactgroupsCopyGet {
    contactgroups: ContactgroupsCopyGetContactgroup[]
    _csrfToken: string
}

export interface ContactgroupsCopyGetContactgroup {
    Contactgroup: ContactgroupsCopyGetContactgroupSource
    Container: ContactgroupsCopyGetContainer
}

export interface ContactgroupsCopyGetContactgroupSource {
    id: number
    description: string
    container_id: number
}

export interface ContactgroupsCopyGetContainer {
    id: number
    name: string
}

// COPY (POST)

export interface ContactgroupsCopyPost {
    Contactgroup: ContactgroupsCopyPostContactgroup
    Source: ContactgroupsCopyPostSource
    Error: GenericValidationError | null
}

export interface ContactgroupsCopyPostContactgroup {
    container: ContactgroupsCopyPostContainer
    description: string
}

export interface ContactgroupsCopyPostContainer {
    name: string
}

export interface ContactgroupsCopyPostSource {
    id: number
    name: string
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
    serviceescalations: ContactgroupsUsedByRootServiceescalation[]
    hostescalations: ContactgroupsUsedByRootHostescalation[]
    services: ContactgroupsUsedByRootService[]
    servicetemplates: ContactgroupsUsedByRootServicetemplate[]
    hosts: ContactgroupsUsedByRootHost[]
    hosttemplates: ContactgroupsUsedByRootHosttemplate[]
    container: ContactgroupsUsedByRootContainer
}

export interface ContactgroupsUsedByRootServiceescalation {
    id: number
    _joinData: JoinData
    ContactgroupsToServiceescalations: ContactgroupsToServiceescalations
}

export interface JoinData {
    id: number
    contactgroup_id: number
    serviceescalation_id: number
}

export interface ContactgroupsToServiceescalations {
    contactgroup_id: number
}

export interface ContactgroupsUsedByRootHostescalation {
    id: number
    _joinData: JoinData2
    ContactgroupsToHostescalations: ContactgroupsToHostescalations
}

export interface JoinData2 {
    id: number
    contactgroup_id: number
    hostescalation_id: number
}

export interface ContactgroupsToHostescalations {
    contactgroup_id: number
}

export interface ContactgroupsUsedByRootService {
    id: number
    name: string
    ContactgroupsToServices: ContactgroupsToServices
}

export interface ContactgroupsToServices {
    contactgroup_id: number
}

export interface ContactgroupsUsedByRootServicetemplate {
    id: number
    name: string
    ContactgroupsToServicetemplates: ContactgroupsToServicetemplates
}


export interface ContactgroupsToServicetemplates {
    contactgroup_id: number
}

export interface ContactgroupsUsedByRootHost {
    id: number
    name: string
    address: string
    ContactgroupsToHosts: ContactgroupsToHosts
}


export interface ContactgroupsToHosts {
    contactgroup_id: number
}

export interface ContactgroupsUsedByRootHosttemplate {
    id: number
    name: string
    ContactgroupsToHosttemplates: ContactgroupsToHosttemplates
}


export interface ContactgroupsToHosttemplates {
    contactgroup_id: number
}

export interface ContactgroupsUsedByRootContainer {
    name: string
}


// GET CONTACTS BY CONTAINER
export interface GetContactsByContainerIdRoot {
    contacts: GetContactsByContainerIdRootContact[]
    _csrfToken: string
}

export interface GetContactsByContainerIdRootContact {
    key: number
    value: string
}

/*********************************
 *    Definition of Container    *
 *********************************/
export interface LoadContainersRoot {
    containers: LoadContainersContainer[]
    _csrfToken: string
}

export interface LoadContainersContainer {
    key: number
    value: string
}
