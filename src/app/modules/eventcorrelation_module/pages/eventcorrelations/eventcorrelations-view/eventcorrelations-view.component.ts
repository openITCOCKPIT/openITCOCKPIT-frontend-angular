import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';


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

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { Subscription } from 'rxjs';
import { EventcorrelationsService } from '../eventcorrelations.service';
import { EvcTree, EventcorrelationRootElement } from '../eventcorrelations.interface';
import { BlockLoaderComponent } from '../../../../../layouts/primeng/loading/block-loader/block-loader.component';
import { EvcTreeComponent } from './evc-tree/evc-tree.component';
import { EvcTreeDirection } from './evc-tree/evc-tree.enum';


@Component({
    selector: 'oitc-eventcorrelations-view',
    imports: [
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FaIconComponent,
    FormsModule,
    NavComponent,
    NavItemComponent,
    NgIf,
    PermissionDirective,
    ReactiveFormsModule,
    RowComponent,
    TranslocoDirective,
    XsButtonDirective,
    RouterLink,
    BackButtonDirective,
    BlockLoaderComponent,
    EvcTreeComponent,
    NgClass
],
    templateUrl: './eventcorrelations-view.component.html',
    styleUrl: './eventcorrelations-view.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventcorrelationsViewComponent implements OnInit, OnDestroy {

    public id: number = 0;

    public evcTree: EvcTree[] = [];
    public evcTreeDirection: EvcTreeDirection = EvcTreeDirection.RIGHT_TO_LEFT;
    public rootElement?: EventcorrelationRootElement;
    public hasWritePermission: boolean = false;

    public showInfoForDisabledService: number = 0;
    public disabledServices: number = 0; //number of disabled services in the EVC
    public stateForDisabledService: number = 3; // Unknown
    public animated: number = 0; // not animated
    public connectionLine: string = 'bezier'; // bezier, straight, segment

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
            this.animated = result.animated;
            this.connectionLine = result.connectionLine;

            this.downtimedServices = result.downtimedServices;
            this.stateForDowntimedService = result.stateForDowntimedService;

        }));
    }
}
