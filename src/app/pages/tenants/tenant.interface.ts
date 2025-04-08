import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';
import { Container } from '../containers/containers.interface';

/**********************
 *    Index action    *
 **********************/
export interface TenantsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Containers.name]': string
    'filter[Tenants.description]': string
}

export function getDefaultTenantsIndexParams(): TenantsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Containers.name',
        page: 1,
        direction: 'asc',
        'filter[Containers.name]': '',
        'filter[Tenants.description]': ''
    }
}

export interface TenantsIndexRoot extends PaginateOrScroll {
    all_tenants: AllTenant[]
    hasRootPrivileges: boolean
    _csrfToken: string
}

export interface AllTenant {
    Tenant: TenantEnitity
    Container: Container
}

export interface TenantEnitity {
    id?: number
    container_id: number
    description: string
    is_active: number
    number_users: number
    max_users: number
    number_hosts: number
    number_services: number
    firstname: string
    lastname: string
    street: string
    zipcode: any
    city: string
    created?: string
    modified?: string
    allowEdit?: boolean
}

/**********************
 *    Add action    *
 **********************/
export interface TenantPost {
    id?: number
    container_id?: number
    description: string
    is_active?: number
    number_users?: number
    max_users?: number
    number_hosts?: number
    number_services?: number
    firstname: string
    lastname: string
    street: string
    zipcode: null | number
    city: string
    created?: string
    modified?: string
    container: {
        id?: number
        containertype_id?: number
        name: string
        parent_id?: number
        lft?: number
        rght?: number
    }
}
