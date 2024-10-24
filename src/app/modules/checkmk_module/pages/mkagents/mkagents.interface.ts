/**********************
 *    Index action    *
 **********************/
import { PaginateOrScroll } from '../../../../layouts/coreui/paginator/paginator.interface';

export interface MkagentsIndexParams {
    angular: true,
    scroll: boolean,
    sort: string,
    page: number,
    direction: 'asc' | 'desc' | '', // asc or desc
    'filter[Mkagents.name]': string,
    'filter[Mkagents.description]': string
    'filter[Mkagents.command_line]': string
}

export function getDefaultMkagentsIndexParams(): MkagentsIndexParams {
    return {
        angular: true,
        scroll: true,
        sort: 'Mkagents.name',
        page: 1,
        direction: 'asc',
        'filter[Mkagents.name]': "",
        'filter[Mkagents.description]': "",
        'filter[Mkagents.command_line]': ""
    }
}


export interface MkagentsIndexRoot extends PaginateOrScroll {
    all_agents: MkagentCake2[]
    _csrfToken: string
}

export interface MkagentCake2 {
    Mkagent: Mkagent
}

export interface Mkagent {
    id: number
    container_id: number
    name: string
    description: string
    command_line: string
}

/**********************
 *  Download action   *
 **********************/

export interface MkagentsDownloadRoot {
    agents: {
        unix: MkagentsDownloadFileTypes,
        windows: MkagentsDownloadFileTypes,
        z_os: MkagentsDownloadFileTypes
    }
    base_path: string,
    _csrfToken: string
}

export interface MkagentsDownloadFileTypes {
    agents: MkagentsDownloadFile[]
    cfg_examples: MkagentsDownloadFile[],
    plugins: MkagentsDownloadFile[],
    special: MkagentsDownloadFile[],
    files: MkagentsDownloadFile[]
}

export interface MkagentsDownloadFile {
    filename: string,
    path: string,
}

