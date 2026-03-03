import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CustomAlertsService } from '../../pages/customalerts/customalerts.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { CustomalertServiceHistory } from '../../pages/customalerts/customalerts.interface';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    NavComponent,
    NavItemComponent,
    TableDirective,
    TextColorDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';


import { PermissionDirective } from '../../../../permissions/permission.directive';
import { TableLoaderComponent } from '../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-customalerts-service-history',
    imports: [
        TranslocoDirective,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        CardBodyComponent,
        PermissionDirective,
        TableDirective,
        TextColorDirective,
        TableLoaderComponent,
        RouterLink
    ],
    templateUrl: './customalerts-service-history.component.html',
    styleUrl: './customalerts-service-history.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomalertsServiceHistoryComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly CustomAlertsService: CustomAlertsService = inject(CustomAlertsService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly TranslocoService = inject(TranslocoService);

    protected serviceHistory?: CustomalertServiceHistory;

    @Input({required: true}) serviceId: number = 0;

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public ngOnInit(): void {
        this.reload();
    }

    protected reload(): void {

        this.subscriptions.add(this.CustomAlertsService.getServiceHistory(this.serviceId)
            .subscribe((result: CustomalertServiceHistory) => {
                this.serviceHistory = result;
                this.cdr.markForCheck();
            }))
    }

}
