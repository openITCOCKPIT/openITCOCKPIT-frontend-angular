import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ContainerComponent,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

import { NgClass, NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import { Subscription } from 'rxjs';
import { CustomAlertHistory } from '../customalerts.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomAlertsService } from '../customalerts.service';
import { PermissionDirective } from '../../../../../permissions/permission.directive';

@Component({
    selector: 'oitc-customalerts-history',
    imports: [
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    NavComponent,
    NavItemComponent,
    TranslocoDirective,
    XsButtonDirective,
    ContainerComponent,
    NgForOf,
    NgIf,
    NoRecordsComponent,
    PermissionDirective,
    RouterLink,
    NgClass
],
    templateUrl: './customalerts-history.component.html',
    styleUrl: './customalerts-history.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomalertsHistoryComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly CustomAlertsService: CustomAlertsService = inject(CustomAlertsService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);

    protected id: number = 0;
    protected history: CustomAlertHistory = {} as CustomAlertHistory;

    constructor() {
    }

    public ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));

        this.subscriptions.add(this.CustomAlertsService.getHistory(this.id)
            .subscribe((result: CustomAlertHistory) => {
                this.history = result;
                this.cdr.markForCheck();
            }))

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


    protected reload(): void {

    }
}
