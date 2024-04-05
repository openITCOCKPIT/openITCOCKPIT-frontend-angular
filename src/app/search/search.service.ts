import { inject, Injectable } from '@angular/core';
import { SearchType } from "./search-type.enum";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { take } from "rxjs";
import { PROXY_PATH } from "../tokens/proxy-path.token";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly proxyPath = inject(PROXY_PATH);

  public search(type: SearchType, query: string): void {
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
      case SearchType.UUID:
        this.searchUUID(type, query);
        break;
      case SearchType.TagsHost:
        this.searchTagsHost(query);
        break;
      case SearchType.TagsService:
        this.searchTagsService(query);
        break;
    }
  }

  public isUUID(value: string): boolean {
    const RegExObject = new RegExp('([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})', 'i');
    return value.match(RegExObject) !== null;
  }

  private searchHost(query: string): void {
    this.router.navigate(['/hosts/index'], {
      queryParams: {
        hostname: query,
      },
    });
  }

  private searchAddress(query: string): void {
    this.router.navigate(['/#!/hosts/index'], {
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

  private searchUUID(type: SearchType, query: string): void {
    const proxyPath = this.proxyPath;
    this.http.post(`${proxyPath}/angular/topSearch.json?angular=true`, {
      type,
      searchStr: query,
    }).pipe(
      take(1),
    ).subscribe({
      next: (data) => console.info('search uuid result', data),
    })
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
