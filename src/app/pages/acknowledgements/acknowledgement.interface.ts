import { PaginateOrScroll } from '../../layouts/coreui/paginator/paginator.interface';

export interface AcknowledgementObject extends AcknowledgedHost {
    commentDataHtml: string
}


/**********************
 *    Host action    *
 **********************/
export interface AcknowledgementsHostParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[AcknowledgementHosts.comment_data]': '',
    'filter[AcknowledgementHosts.state][]': string[],
    'filter[AcknowledgementHosts.author_name]': string,
    'filter[from]': Date | string,
    'filter[to]': Date | string,
}

export function getDefaultAcknowledgementsHostParams(): AcknowledgementsHostParams {
    let now = new Date();
    return {
        angular: true,
        scroll: true,
        sort: 'AcknowledgementHosts.entry_time',
        page: 1,
        direction: 'desc',
        'filter[AcknowledgementHosts.comment_data]': '',
        'filter[AcknowledgementHosts.state][]': [],
        'filter[AcknowledgementHosts.author_name]': '',
        'filter[from]': new Date(now.getTime() - (3600 * 24 * 3000 * 4)),
        'filter[to]': new Date(now.getTime() + (3600 * 24 * 5)),
    }
}

export interface AcknowledgementsHostRoot extends PaginateOrScroll {
    all_acknowledgements: {
        AcknowledgedHost: AcknowledgedHost
    }[]
}

export interface AcknowledgedHost {
    acknowledgement_type: number
    author_name: string
    comment_data: string
    entry_time: string
    is_sticky: boolean
    notify_contacts: boolean
    persistent_comment: boolean
    state: number
    allowEdit: boolean
}

/**********************
 *   Service action   *
 **********************/
export interface AcknowledgementsServiceParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[AcknowledgementServices.comment_data]': '',
    'filter[AcknowledgementServices.state][]': string[],
    'filter[AcknowledgementServices.author_name]': string,
    'filter[from]': Date | string,
    'filter[to]': Date | string,
}

export function getDefaultAcknowledgementsServiceParams(): AcknowledgementsServiceParams {
    let now = new Date();
    return {
        angular: true,
        scroll: true,
        sort: 'AcknowledgementServices.entry_time',
        page: 1,
        direction: 'desc',
        'filter[AcknowledgementServices.comment_data]': '',
        'filter[AcknowledgementServices.state][]': [],
        'filter[AcknowledgementServices.author_name]': '',
        'filter[from]': new Date(now.getTime() - (3600 * 24 * 3000 * 4)),
        'filter[to]': new Date(now.getTime() + (3600 * 24 * 5)),
    }
}

export interface AcknowledgementsServiceRoot extends PaginateOrScroll {
    all_acknowledgements: {
        AcknowledgedService: AcknowledgedService
    }[]
}

export interface AcknowledgedService extends AcknowledgedHost {

}

/************************************
 *   Host /Service browser action   *
 ************************************/
export interface DeleteAcknowledgementItem {
    displayName: string,
    hostId: number,
    serviceId: number | null,
}
