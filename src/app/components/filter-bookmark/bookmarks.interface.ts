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
    ownership?: boolean
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
    bookmark: BookmarksObject | null
}

export interface BookmarkPost {
    name: string
    favorite: boolean
    filter: string
    plugin: string
    controller: string
    action: string

}
