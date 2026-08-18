/**********************
 *    Index action    *
 **********************/
import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

export interface LdapgroupsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Ldapgroups.id][]': number[],
    'filter[Ldapgroups.cn]': string
    'filter[Ldapgroups.dn]': string
    'filter[Ldapgroups.description]': string
}

export function getDefaultLdapgroupsIndexParams(): LdapgroupsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Ldapgroups.cn',
        page: 1,
        direction: 'asc',
        'filter[Ldapgroups.id][]': [],
        'filter[Ldapgroups.cn]': "",
        'filter[Ldapgroups.dn]': "",
        'filter[Ldapgroups.description]': "",
    }
}

export interface LdapgroupsIndexRoot extends PaginateOrScroll {
    all_ldapgroups: LdapgroupIndex[]
    _csrfToken: string
}

/**********************
 *    Index action    *
 **********************/

export interface LdapgroupIndex {
    Ldapgroup: LdapgroupObject
}

export interface LdapgroupObject {
    id: number
    cn: string
    dn: string
    description: string
}
