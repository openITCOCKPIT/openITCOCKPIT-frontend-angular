/*
 * Copyright (C) <2015-present>  <it-novum GmbH>
 *
 * This file is dual licensed
 *
 * 1.
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, version 3 of the License.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * 2.
 *     If you purchased an openITCOCKPIT Enterprise Edition you can use this file
 *     under the terms of the openITCOCKPIT Enterprise Edition license agreement.
 *     License agreement and license key will be shipped with the order
 *     confirmation.
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { PROXY_PATH } from "../tokens/proxy-path.token";
import { Permission } from './permission.type';

import { BehaviorSubject, filter, map, Observable, switchMap, take } from "rxjs";
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

    private readonly modules$$ = new BehaviorSubject<string[]>([]);
    public readonly modules$ = this.modules$$.asObservable();

    public permissions: any = {};
    public modules: any = {};

    public constructor() {
        this.loadPermissions();
    }

    public checkPermission(checkChunks: string | string[], againstPermissions: Permission): boolean {
        let _chunks: string[] = [];

        if (!Array.isArray(checkChunks)) {
            _chunks = checkChunks.toLowerCase().split('.');
        } else {
            _chunks = checkChunks
            _chunks = checkChunks.map(chunk => chunk.toLowerCase());
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
            switchMap(() => this.http.get<{
                permissions: Permission,
                modules: string[]
            }>(`${proxyPath}/users/getUserPermissions.json`))
        ).subscribe({
            next: ({permissions, modules}) => {
                this.permissions$$.next(permissions);
                this.modules$$.next(modules);
            }
        });
    }

    // 🧧 ONLY USE THIS IN TEMPLATES AS IT WILL BE EMPTY IN THE BEGINNING
    public hasPermission(checkChunks: string | string[], negate: boolean = false): boolean {
        let permissions = this.permissions$$.getValue();
        let hasPermission = this.checkPermission(checkChunks, permissions);

        if (negate) {
            return !hasPermission;
        }

        return hasPermission;
    }

    // USE this method for Components and Services
    public hasPermissionObservable(checkChunks: string | string[]): Observable<boolean> {
        return this.permissions$$.asObservable().pipe(
            filter(permissions => {
                return Object.keys(permissions).length > 0
            }),
            map(permissions => this.checkPermission(checkChunks, permissions))
        );
    }

    // 🧧 ONLY USE THIS IN TEMPLATES AS IT WILL BE EMPTY IN THE BEGINNING
    public hasModule(module: string): boolean {
        return this.modules$$.getValue().includes(module);
    }

    // USE this method for Components and Services
    public hasModuleObservable(module: string): Observable<boolean> {
        return this.modules$$.asObservable().pipe(
            filter(modules => modules.length > 0),
            map(modules => modules.includes(module))
        );
    }

}
