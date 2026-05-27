import { SelectKeyValue, SelectKeyValueWithDisabled } from '../../layouts/primeng/select.interface';

export interface BookmarksObject {
id: number;
uuid: string;
plugin: string;
controller: string;
action: string;
name: string;
user_id: number;
filter: string;
favorite: boolean;
fav_group: string;
ownership?: boolean;
filter_bookmark_allocation?: allocatedFilterbookmark | null;
}

export interface BookmarkResponse {
    _csrfToken: string
    bookmark: BookmarksObject
}

export interface BookmarksParams {
    angular: boolean
    plugin: string
    controller: string
    action: string
    queryFilter?: string
}

export interface BookmarksIndexRoot {
    bookmarks: BookmarksObject[],
    bookmark: BookmarksObject | null,
    allocated: any | null,
}

export interface BookmarkPost {
    name: string
    favorite: boolean
    filter: string
    plugin: string
    controller: string
    action: string
}

export interface BookmarkAllocateContainerResponse {
    users: SelectKeyValue[]
    usergroups: SelectKeyValue[],
    filter_bookmarks: SelectKeyValueWithDisabled[];
    allocated_filter_bookmarks: allocatedFilterbookmark[]
    _csrfToken: string
}

export interface allocatedFilterbookmark {
    id?: number,
    filter_bookmark_id: number,
    container_id: number,
    name: string,
    user_id?: number,
    usergroups: {
        _ids: number[]
    }
    users: {
        _ids: number[]
    }
}
