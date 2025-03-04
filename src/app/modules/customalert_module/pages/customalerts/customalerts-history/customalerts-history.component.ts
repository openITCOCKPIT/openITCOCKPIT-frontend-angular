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
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

import { NgClass, NgForOf, NgIf } from '@angular/common';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import { Subscription } from 'rxjs';
import { CustomAlertHistory } from '../customalerts.interface';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomAlertsService } from '../customalerts.service';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { BlockLoaderComponent } from '../../../../../layouts/primeng/loading/block-loader/block-loader.component';

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
        NgClass,
        BlockLoaderComponent
    ],
    templateUrl: './customalerts-history.component.html',
    styleUrl: './customalerts-history.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomalertsHistoryComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly CustomAlertsService: CustomAlertsService = inject(CustomAlertsService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);

    protected id: number = 0;
    protected history!: CustomAlertHistory;

    constructor() {
    }

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            this.id = Number(this.route.snapshot.paramMap.get('id'));

            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            this.load();
        }));
    }

    public load(): void {
        this.subscriptions.add(this.CustomAlertsService.getHistory(this.id)
            .subscribe((result: CustomAlertHistory) => {
                this.history = result;
                this.cdr.markForCheck();
            }))
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}
