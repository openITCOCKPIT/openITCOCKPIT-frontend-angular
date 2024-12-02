import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { HistoryService } from '../../../../../history.service';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { LoadContainersRoot, LoadSatellitesRoot, MapPost } from '../Maps.interface';
import { MapsService } from '../Maps.service';

@Component({
    selector: 'oitc-maps-add',
    standalone: true,
    imports: [
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink,

        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        NavItemComponent,
        BackButtonDirective,
        CardBodyComponent,
        RequiredIconComponent,
        SelectComponent,
        FormErrorDirective,
        NgIf,
        FormFeedbackComponent,
        FormsModule,
        FormDirective,
        FormLabelDirective,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        TrueFalseDirective,
        FormCheckLabelDirective,
        MultiSelectComponent,
        CardFooterComponent,
        DropdownComponent,
        DropdownToggleDirective,
        DropdownMenuDirective,
        DropdownItemDirective,
        FaStackComponent,
        FaStackItemSizeDirective,
        PermissionDirective,
        AsyncPipe,
    ],
    templateUrl: './maps-add.component.html',
    styleUrl: './maps-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapsAddComponent implements OnInit, OnDestroy {

    private readonly MapsService: MapsService = inject(MapsService);
    private readonly TranslocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private router: Router = inject(Router);

    private subscriptions: Subscription = new Subscription();

    public readonly route = inject(ActivatedRoute);
    public errors: GenericValidationError | null = null;
    public post: MapPost = {} as MapPost;
    protected createAnother: boolean = false;
    protected containers: SelectKeyValue[] = [];
    protected satellites: SelectKeyValue[] = [];

    private cdr = inject(ChangeDetectorRef);

    constructor() {
        this.post = this.getDefaultPost();
    }

    private getDefaultPost(): MapPost {
        return {
            Map: {
                name: '',
                title: '',
                refresh_interval: 90,
                containers: {
                    _ids: []
                },
                satellites: {
                    _ids: []
                }
            }
        };
    }

    public ngOnInit() {
        this.load();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public submit(): void {
        this.subscriptions.add(this.MapsService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Map');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['map_module', 'maps', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/map_module/maps/index']);
                        return;
                    }
                    this.post = this.getDefaultPost();
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;

                }
            }))
    }

    private load(): void {
        this.subscriptions.add(this.MapsService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.containers = result.containers;
                this.cdr.markForCheck();
            }))
    }

    private loadSatellites(): void {
        this.subscriptions.add(this.MapsService.loadSatellites(this.post.Map.containers._ids)
            .subscribe((result: LoadSatellitesRoot) => {
                this.satellites = result.satellites;
                this.cdr.markForCheck();
            }))
    }

    public onContainerChange(): void {
        if (this.post.Map.containers._ids.length === 0) {
            //Create another
            return;
        }
        this.loadSatellites();
    }

}
