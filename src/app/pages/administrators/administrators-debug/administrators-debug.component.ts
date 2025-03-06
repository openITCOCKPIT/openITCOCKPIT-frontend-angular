import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    RowComponent
} from '@coreui/angular';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { SystemnameService } from '../../../services/systemname.service';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { AdministratorsDebugRootResponse } from '../administrators.interface';
import { OitcAlertComponent } from '../../../components/alert/alert.component';
import { AdministratorsService } from '../administrators.service';
import { CookieService } from 'ngx-cookie-service';
import { EolAlertsComponent } from './eol-alerts/eol-alerts.component';

@Component({
    selector: 'oitc-administrators-debug',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        RouterLink,
        AsyncPipe,
        CardBodyComponent,
        RowComponent,
        ColComponent,
        NgIf,
        OitcAlertComponent,
        NgClass,
        EolAlertsComponent
    ],
    templateUrl: './administrators-debug.component.html',
    styleUrl: './administrators-debug.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdministratorsDebugComponent implements OnInit, OnDestroy {

    public response?: AdministratorsDebugRootResponse;
    public hasXdebugCookie: boolean = false;

    private subscriptions: Subscription = new Subscription();
    public readonly SystemnameService = inject(SystemnameService);
    public readonly AdministratorsService = inject(AdministratorsService);
    private readonly CookieService = inject(CookieService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.load();
        this.hasXdebugCookie = this.CookieService.check('XDEBUG_TRIGGER');
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load() {
        this.subscriptions.add(
            this.AdministratorsService.getDebug().subscribe(response => {
                this.response = response;
                this.cdr.markForCheck();
            })
        );
    }

    public setXdebugCookie() {
        this.hasXdebugCookie = true;
        this.CookieService.set('XDEBUG_TRIGGER', 'true', {
            expires: undefined,
            secure: true,
            path: '/',
            sameSite: 'None'
        });
        this.cdr.markForCheck();
    }

    public removeXdebugCookie() {
        this.CookieService.delete('XDEBUG_TRIGGER', '/');
        this.hasXdebugCookie = false;
        this.cdr.markForCheck();
    }

}
