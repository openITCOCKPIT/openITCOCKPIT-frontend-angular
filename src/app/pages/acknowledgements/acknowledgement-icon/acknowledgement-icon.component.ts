import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { PermissionsService } from '../../../permissions/permissions.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AsyncPipe } from '@angular/common';
import { AcknowledgementObject } from '../acknowledgement.interface';
import { AcknowledgementTypes } from '../acknowledgement-types.enum';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { ColComponent, PopoverDirective, RowComponent, TooltipDirective } from '@coreui/angular';
import { AcknowledgementsService } from '../acknowledgements.service';
import { Subscription } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
    selector: 'oitc-acknowledgement-icon',
    imports: [
        FaIconComponent,
        TranslocoDirective,
        TooltipDirective,
        TranslocoPipe,
        PopoverDirective,
        SkeletonModule,
        RowComponent,
        ColComponent,
        AsyncPipe
    ],
    templateUrl: './acknowledgement-icon.component.html',
    styleUrl: './acknowledgement-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcknowledgementIconComponent implements OnInit, OnDestroy {
    @Input() public type: 'hosts' | 'services' = 'hosts';
    @Input() public objectId: number | undefined = 0;
    @Input() public acknowledgement_type?: AcknowledgementTypes = AcknowledgementTypes.Normal;

    public acknowledgement?: AcknowledgementObject;
    public isLoading: boolean = true;

    public readonly PermissionsService = inject(PermissionsService);
    public readonly AcknowledgementsService = inject(AcknowledgementsService);

    protected readonly AcknowledgementTypes = AcknowledgementTypes;

    private subscriptions: Subscription = new Subscription();

    private timeout: any = null;
    private cdr = inject(ChangeDetectorRef);

    public loadAcknowledgementDetails(): void {
        this.isLoading = true;
        if (this.timeout === null) {
            this.acknowledgement = undefined;
            this.timeout = setTimeout(() => {
                if (this.objectId) {
                    this.subscriptions.add(
                        this.AcknowledgementsService.getAcknowledgementTooltipDetails(this.objectId, this.type)
                            .subscribe(acknowledgement => {
                                this.acknowledgement = acknowledgement;
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
            this.cdr.markForCheck();
        }
    }
}
