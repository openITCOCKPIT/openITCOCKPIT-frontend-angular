import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { BlockLoaderComponent } from '../../../../../layouts/primeng/loading/block-loader/block-loader.component';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { EvcTreeComponent } from '../eventcorrelations-view/evc-tree/evc-tree.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventcorrelationsService } from '../eventcorrelations.service';
import { EvcSummaryService, EventcorrelationRootElement } from '../eventcorrelations.interface';
import { EvcTableComponent } from '../eventcorrelations-view/evc-table/evc-table.component';

@Component({
    selector: 'oitc-eventcorrelations-summary-view',
    standalone: true,
    imports: [
        BackButtonDirective,
        BlockLoaderComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        EvcTreeComponent,
        FaIconComponent,
        NavComponent,
        NavItemComponent,
        NgIf,
        PermissionDirective,
        RowComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        TableDirective,
        NgClass,
        EvcTableComponent
    ],
    templateUrl: './eventcorrelations-summary-view.component.html',
    styleUrl: './eventcorrelations-summary-view.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventcorrelationsSummaryViewComponent implements OnInit, OnDestroy {

    public id: number = 0;

    public evcSummaryTree: EvcSummaryService[][] = [];
    public rootElement?: EventcorrelationRootElement;
    public hasWritePermission: boolean = false;

    public showInfoForDisabledService: number = 0;
    public disabledServices: number = 0; //number of disabled services in the EVC
    public stateForDisabledService: number = 3; // Unknown

    public downtimedServices: number = 0; //number of services in a downtime in the EVC
    public stateForDowntimedService: number = 3; // Unknown

    private subscriptions: Subscription = new Subscription();
    private readonly EventcorrelationsService = inject(EventcorrelationsService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.id = Number(this.route.snapshot.paramMap.get('id'));
            this.loadEventcorrelationSummary();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadEventcorrelationSummary() {
        this.subscriptions.add(this.EventcorrelationsService.getEventcorrelationView(this.id).subscribe((result) => {
            this.cdr.markForCheck();

            this.evcSummaryTree = result.evcSummaryTree;

            this.rootElement = result.rootElement;
            this.hasWritePermission = result.hasWritePermission;
            this.showInfoForDisabledService = result.showInfoForDisabledService;
            this.stateForDisabledService = result.stateForDisabledService;
            this.disabledServices = result.disabledServices;

            this.downtimedServices = result.downtimedServices;
            this.stateForDowntimedService = result.stateForDowntimedService;
        }));
    }

}
