import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActionsButtonComponent } from '../../../../../components/actions-button/actions-button.component';
import {
    ActionsButtonElementComponent
} from '../../../../../components/actions-button-element/actions-button-element.component';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { Subscription } from 'rxjs';
import { EventcorrelationsService } from '../eventcorrelations.service';
import { EvcTree, EventcorrelationRootElement } from '../eventcorrelations.interface';
import { BlockLoaderComponent } from '../../../../../layouts/primeng/loading/block-loader/block-loader.component';
import { EvcTreeComponent } from './evc-tree/evc-tree.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import { AgentHttpClientErrors } from '../../../../../pages/agentconnector/agentconnector.enums';

@Component({
    selector: 'oitc-eventcorrelations-view',
    standalone: true,
    imports: [
        ActionsButtonComponent,
        ActionsButtonElementComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        PermissionDirective,
        ReactiveFormsModule,
        RowComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,
        BackButtonDirective,
        BlockLoaderComponent,
        EvcTreeComponent,
        NoRecordsComponent,
        NgClass
    ],
    templateUrl: './eventcorrelations-view.component.html',
    styleUrl: './eventcorrelations-view.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventcorrelationsViewComponent implements OnInit, OnDestroy {

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

    protected readonly AgentHttpClientErrors = AgentHttpClientErrors;
}
