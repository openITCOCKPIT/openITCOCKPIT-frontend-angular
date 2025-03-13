import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslocoDirective } from '@jsverse/transloco';
import { AsyncPipe, NgForOf, NgIf, NgStyle } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    ButtonDirective,
    ButtonGroupComponent,
    DropdownComponent, DropdownMenuDirective,
    DropdownToggleDirective, ProgressComponent,
    TooltipDirective
} from '@coreui/angular';
import { RouterLink } from '@angular/router';
import { SystemHealthService } from './system-health.service';
import { PermissionsService } from '../../../../permissions/permissions.service';


export interface SystemHealth {
    isNagiosRunning?: boolean,
    isNdoRunning?: boolean,
    isStatusengineRunning?: boolean,
    isNpcdRunning?: boolean,
    isOitcCmdRunning?: boolean,
    isSudoServerRunning?: boolean,
    isNstaRunning?: boolean,
    isGearmanWorkerRunning?: boolean,
    isNdoInstalled?: boolean,
    isStatusengineInstalled?: boolean,
    isStatusenginePerfdataProcessor?: boolean,
    isDistributeModuleInstalled?: boolean,
    isPushNotificationRunning?: boolean,
    isNodeJsServerRunning?: boolean,
    previousState?: string,
    update: string,
    cache_readable?: boolean,
    gearman_reachable?: boolean,
    gearman_worker_running?: boolean,
    state: string,
    errorCount: number
    load?: {
        load1: number,
        load5: number,
        load15: number,
        cores: number,
        state: string
    },
    disk_usage?:
        {
            disk: string,
            size: string,
            used: string,
            avail: string,
            use_percentage: number,
            mountpoint: string,
            state: string
        }[],
    memory_usage?: {
        memory: {
            total: number,
            used: number,
            free: number,
            buffers: number,
            cached: number,
            percentage: number,
            state: string
        },
        swap: {
            total: number,
            used: number,
            free: number,
            percentage: number,
            state: string
        }
    },
    satellites?:
        {
            id: number,
            name: string,
            description: string | null,
            address: string,
            container_id: number,
            timezone: string,
            sync_method: string,
            status: number,
            satellite_status: {
                status: number,
                last_error: string,
                last_export: string,
                last_seen: string,
                satellite_id: number
            },
            allow_edit: boolean
        }[]


}

@Component({
  selector: 'oitc-system-health',
    imports: [
        TranslocoDirective,
        ButtonGroupComponent,
        NgIf,
        FaIconComponent,
        DropdownComponent,
        NgStyle,
        ButtonDirective,
        DropdownToggleDirective,
        DropdownMenuDirective,
        RouterLink,
        ProgressComponent,
        NgForOf,
        TooltipDirective,
        AsyncPipe,

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

    protected systemHealth:SystemHealth = this.systemHealthDefault;
    protected class:string = '';
    protected bgClass:string = '';
    protected btnClass:string = '';

    public ngOnInit() {
        timer(0, 60000).pipe(takeUntil(this.destroy$)).subscribe({next: () => {
                this.getSystemHealth();
            }});
    }

    public ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.subscriptions.unsubscribe();
    }

    protected getHealthClass(){
        switch(this.systemHealth.state){
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

    protected getHealthBgClass(){
        switch(this.systemHealth.state){
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

    protected getHealthBtnClass (){
        switch(this.systemHealth.state){
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
            if(data.status.cache_readable){
                this.systemHealth = data.status;
            }else{
                this.systemHealth = this.systemHealthDefault;
            }
            this.class = this.getHealthClass();
            this.bgClass = this.getHealthBgClass();
            this.btnClass = this.getHealthBtnClass();
            this.cdr.markForCheck();
        }));
    }
}
