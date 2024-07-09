import { Observable } from 'rxjs';

export interface EnableItem {
    id: number,
    displayName: string
}

export interface EnableModalService {
    enable(item: EnableItem): Observable<any>;
}

export interface EnableResponse {
    success: boolean
    _csrfToken: string
}
