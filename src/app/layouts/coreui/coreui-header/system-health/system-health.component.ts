import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslocoDirective } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    DropdownComponent,
    DropdownMenuDirective,
    DropdownToggleDirective,
    ProgressComponent,
    TooltipDirective
} from '@coreui/angular';
import { RouterLink } from '@angular/router';
import { SystemHealthService } from './system-health.service';
import { PermissionsService } from '../../../../permissions/permissions.service';
import { XsButtonDirective } from '../../xsbutton-directive/xsbutton.directive';

import { SystemHealth } from './system-health.interface';


@Component({
    selector: 'oitc-system-health',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        DropdownComponent,
        DropdownToggleDirective,
        DropdownMenuDirective,
        RouterLink,
        ProgressComponent,
        TooltipDirective,
        AsyncPipe,
        XsButtonDirective
    ],
    templateUrl: './system-health.component.html',
    styleUrl: './system-health.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemHealthComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private destroy$ = new Subject<void>();
    private cdr = inject(ChangeDetectorRef);
    private readonly SystemHealthService: SystemHealthService = inject(SystemHealthService);
    public readonly PermissionsService: PermissionsService = inject(PermissionsService);

    protected systemHealthDefault: SystemHealth = {
        state: 'unknown',
        update: 'n/a',
        errorCount: 0
    }

    protected systemHealth: SystemHealth = this.systemHealthDefault;
    protected class: string = '';
    protected bgClass: string = '';
    protected btnClass: string = '';
    protected classSat?: string = '';
    protected bgClassSat?: string = '';
    protected btnClassSat?: string = '';

    public ngOnInit() {
        timer(0, 60000).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.getSystemHealth();
            }
        });
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.subscriptions.unsubscribe();
    }

    protected getHealthClass(state:string) {
        switch (state) {
            case 'ok':
                return 'up';

            case 'warning':
                return 'warning';

            case 'critical':
                return 'down';

            default:
                return 'not-monitored';
        }
    }

    protected getHealthBgClass(state:string) {
        switch (state) {
            case 'ok':
                return 'bg-up';

            case 'warning':
                return 'bg-warning';

            case 'critical':
                return 'bg-down';

            default:
                return 'bg-not-monitored';
        }
    }

    protected getHealthBtnClass(state:string) {
        switch (state) {
            case 'ok':
                return 'btn-success';

            case 'warning':
                return 'btn-warning';

            case 'critical':
                return 'btn-danger';

            default:
                return 'btn-primary';
        }
    }

    protected getSystemHealth() {
        this.subscriptions.add(this.SystemHealthService.getSystemHealth().subscribe((data: any) => {
            if (data.status.cache_readable) {
                this.systemHealth = data.status;
            } else {
                this.systemHealth = this.systemHealthDefault;
            }
            this.class = this.getHealthClass(this.systemHealth.state);
            this.bgClass = this.getHealthBgClass(this.systemHealth.state);
            this.btnClass = this.getHealthBtnClass(this.systemHealth.state);

            if (this.systemHealth.satellites_state){
                this.classSat = this.getHealthClass(this.systemHealth.satellites_state);
                this.bgClassSat = this.getHealthBgClass(this.systemHealth.satellites_state);
                this.btnClassSat = this.getHealthBtnClass(this.systemHealth.satellites_state);
            }

            this.cdr.markForCheck();
        }));
    }
}
