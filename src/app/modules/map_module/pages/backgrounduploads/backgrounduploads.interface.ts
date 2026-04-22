import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { GenericIdAndName } from '../../../../generic.interfaces';

export interface BackgroundsRoot extends PaginateOrScroll {
    all_backgrounds: Upload[]
    _csrfToken: any
}

export interface UploadsIconsRoot extends PaginateOrScroll {
    all_icons: Upload[]
    _csrfToken: any
}


export interface Upload {
    id: number
    upload_name: string
    saved_name: string
    user: {
        id: number
    }
    maps: GenericIdAndName[]
    allowEdit: boolean
}

export interface MapUploadEdit {
    uploadedFile: MapUploadItem
    areContainersChangeable: boolean
    requiredContainers: number[]
    _csrfToken: string
}

export interface MapUploadItem {
    id: number
    upload_type: number
    upload_name: string
    saved_name: string
    path: string
    containers: { _ids: number[] }
}

export function getDefaultMapUploadsParams(): MapUploadsParams {
    return {
        angular: true,
        scroll: true,
        sort: 'MapUploads.upload_name',
        page: 1,
        direction: 'asc',
        'filter[MapUploads.upload_name]': '',
    }
}

/**********************
 *    Backgrounds action    *
 **********************/
export interface MapUploadsParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[MapUploads.upload_name]': string
}
