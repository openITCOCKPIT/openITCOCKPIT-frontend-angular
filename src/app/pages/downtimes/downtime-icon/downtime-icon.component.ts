import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ColComponent, PopoverDirective, RowComponent, TooltipDirective } from '@coreui/angular';
import { SkeletonModule } from 'primeng/skeleton';
import { NgIf } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { DowntimeObject } from '../downtimes.interface';
import { PermissionsService } from '../../../permissions/permissions.service';
import { DowntimesService } from '../downtimes.service';

@Component({
    selector: 'oitc-downtime-icon',
    standalone: true,
    imports: [
        FaIconComponent,
        PopoverDirective,
        RowComponent,
        ColComponent,
        SkeletonModule,
        NgIf,
        TooltipDirective,
        TranslocoPipe,
        TranslocoDirective
    ],
    templateUrl: './downtime-icon.component.html',
    styleUrl: './downtime-icon.component.css'
})
export class DowntimeIconComponent implements OnInit, OnDestroy {
    @Input() public type: 'hosts' | 'services' = 'hosts';
    @Input() public objectId: number | undefined = 0;

    public downtime?: DowntimeObject;
    public isLoading: boolean = true;

    public readonly PermissionsService = inject(PermissionsService);
    public readonly DowntimesService = inject(DowntimesService);

    private subscriptions: Subscription = new Subscription();

    private timeout: any = null;

    public loadDowntimeDetails(): void {
        this.isLoading = true;
        if (this.timeout === null) {
            this.downtime = undefined;
            this.timeout = setTimeout(() => {
                if (this.objectId) {
                    this.subscriptions.add(
                        this.DowntimesService.getDowntimeTooltipDetails(this.objectId, this.type)
                            .subscribe(downtime => {
                                this.downtime = downtime;
                                this.isLoading = false;
                            }));
                }
            }, 150);
        }
    }

    public ngOnInit(): void {

    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public cancelDebounce() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
}
