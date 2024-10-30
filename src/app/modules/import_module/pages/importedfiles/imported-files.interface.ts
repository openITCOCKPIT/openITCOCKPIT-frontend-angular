import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';
import { Container } from '../../../../pages/containers/containers.interface';

/**********************
 *    Index action    *
 **********************/
export interface ImportedFilesIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[ImportedFiles.filename]': string
}

export function getDefaultImportedFilesIndexParams(): ImportedFilesIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'ImportedFiles.filename',
        page: 1,
        direction: 'asc',
        'filter[ImportedFiles.filename]': '',
    }
}

export interface ImportedFilesIndexRoot extends PaginateOrScroll {
    importedfiles: Importedfile[]
    _csrfToken: any
}

export interface Importedfile {
    id: number
    filename: string
    uuid: string
    full_path: string
    container_id: number
    file_size: number
    file_extension: string
    created: string
    full_name: string
    user: {
        id: number
    }
    importer: {
        id: number
        name: string
    }
    container: string
    humanFilesize: string
    allowEdit: boolean
}

/**********************
 *     View action    *
 **********************/
export interface ImportedFilesViewRoot {
    importedfile?: {
        id: number
        filename: string
        uuid: string
        container_id: number
        importer_id: number
        user_id: number
        full_path: string
        uploaded_filename: string
        file_extension: string
        file_size: number
        checksum: string
        created: string
        modified: string
        container: Container
    }
    filecontent: false | string[],
    _csrfToken: any
}
