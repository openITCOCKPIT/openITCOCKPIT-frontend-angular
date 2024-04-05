import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PROXY_PATH } from "../tokens/proxy-path.token";
import { Permission } from './permission.type';

import { BehaviorSubject, filter, map, switchMap, take } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly proxyPath = inject(PROXY_PATH);

  private readonly permissions$$ = new BehaviorSubject<Permission>({});
  public readonly permissions$ = this.permissions$$.asObservable();

  public constructor() {
    this.loadPermissions();
  }

  public checkPermission(checkChunks: string | string[], againstPermissions: Permission): boolean {
    let _chunks: string[] = [];

    if (!Array.isArray(checkChunks)) {
      _chunks = checkChunks.toLowerCase().split('.');
    } else {
      _chunks = checkChunks;
    }

    const result = _chunks.reduce<any>((acc, chunk) => {
      return acc[chunk] || {};
    }, againstPermissions);

    return result === _chunks[_chunks.length - 1];
  }

  private loadPermissions(): void {
    const proxyPath = this.proxyPath;

    this.authService.authenticated$.pipe(
      filter(authenticated => authenticated),
      take(1),
      switchMap(() => this.http.get<{ permissions: Permission }>(`${proxyPath}/users/getUserPermissions.json`)),
      map(({permissions}) => permissions)
    ).subscribe({
      next: permissions => this.permissions$$.next(permissions),
    });
  }
}
