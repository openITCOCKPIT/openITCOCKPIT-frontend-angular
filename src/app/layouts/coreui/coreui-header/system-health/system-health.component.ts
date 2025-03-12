import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
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

export interface SystemHealthDefault {
    state: string;
    update: string;
    errorCount: number;
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
        TooltipDirective
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

    protected systemHealth:SystemHealthDefault |any = {};
    protected class:string = '';
    protected bgClass:string = '';
    protected btnClass:string = '';
    protected systemHealthDefault: SystemHealthDefault = {
        state: 'unknown',
        update: 'n/a',
        errorCount: 0
    }



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
