import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { EvcTree, EventcorrelationRootElement } from '../eventcorrelations.interface';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventcorrelationsService } from '../eventcorrelations.service';
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
    RowComponent
} from '@coreui/angular';
import { EvcTreeComponent } from '../eventcorrelations-view/evc-tree/evc-tree.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { EvcTreeEditComponent } from './evc-tree-edit/evc-tree-edit.component';

@Component({
    selector: 'oitc-eventcorrelations-edit-correlation',
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
        EvcTreeEditComponent,
        NgClass,
        RouterLink
    ],
    templateUrl: './eventcorrelations-edit-correlation.component.html',
    styleUrl: './eventcorrelations-edit-correlation.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventcorrelationsEditCorrelationComponent implements OnInit, OnDestroy {
    public id: number = 0;

    public evcTree: EvcTree[] = [];
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
            this.loadEventcorrelation();
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadEventcorrelation() {
        this.subscriptions.add(this.EventcorrelationsService.getEventcorrelationView(this.id).subscribe((result) => {
            this.cdr.markForCheck();

            this.evcTree = result.evcTree;
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
