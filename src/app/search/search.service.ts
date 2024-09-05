import { inject, Injectable } from '@angular/core';
import { SearchType } from "./search-type.enum";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { PROXY_PATH } from "../tokens/proxy-path.token";
import { TopSearchResponse } from './search.interface';

@Injectable({
    providedIn: 'root'
})
export class SearchService {

    private readonly router = inject(Router);
    private readonly http = inject(HttpClient);
    private readonly proxyPath = inject(PROXY_PATH);

    public redirectSearch(type: SearchType, query: string): void {
        switch (type) {
            case SearchType.Host:
                this.searchHost(query);
                break;
            case SearchType.Address:
                this.searchAddress(query);
                break;
            case SearchType.Service:
                this.searchService(query);
                break;
            case SearchType.TagsHost:
                this.searchTagsHost(query);
                break;
            case SearchType.TagsService:
                this.searchTagsService(query);
                break;

            default:
                console.log('Unknown search type', type);
                break;
        }
    }

    private searchHost(query: string): void {
        this.router.navigate(['/hosts/index'], {
            queryParams: {
                hostname: query,
            },
        });
    }

    private searchAddress(query: string): void {
        this.router.navigate(['/hosts/index'], {
            queryParams: {
                address: query,
            },
        });
    }

    private searchService(query: string): void {
        this.router.navigate(['/services/index'], {
            queryParams: {
                servicename: query,
            },
        });
    }

    public searchUUID(query: string): Observable<TopSearchResponse> {
        const proxyPath = this.proxyPath;
        return this.http.post<TopSearchResponse>(`${proxyPath}/angular/topSearch.json?angular=true`, {
            type: 'uuid',
            searchStr: query,
        }).pipe(
            map(data => {
                return data;
            })
        );
    }

    private searchTagsHost(query: string): void {
        this.router.navigate(['/hosts/index'], {
            queryParams: {
                keywords: query,
            },
        });
    }

    private searchTagsService(query: string): void {
        this.router.navigate(['/services/index'], {
            queryParams: {
                keywords: query,
            },
        });
    }
}
