import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ColComponent, PopoverDirective, RowComponent, TooltipDirective } from '@coreui/angular';
import { SkeletonModule } from 'primeng/skeleton';
import { AsyncPipe } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { DowntimeObject } from '../downtimes.interface';
import { PermissionsService } from '../../../permissions/permissions.service';
import { DowntimesService } from '../downtimes.service';

@Component({
    selector: 'oitc-downtime-icon',
    imports: [
    FaIconComponent,
    PopoverDirective,
    RowComponent,
    ColComponent,
    SkeletonModule,
    TooltipDirective,
    TranslocoPipe,
    TranslocoDirective,
    AsyncPipe
],
    templateUrl: './downtime-icon.component.html',
    styleUrl: './downtime-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
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
    private cdr = inject(ChangeDetectorRef);

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
                                this.cdr.markForCheck();
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
