import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { HistoryService } from '../../../../../history.service';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';

import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';

import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { LoadMapsRoot, RotationPost } from '../rotations.interface';
import { RotationsService } from '../rotations.service';
import { LoadContainersRoot } from '../../../../../pages/containers/containers.interface';

@Component({
    selector: 'oitc-rotations-add',
    imports: [
        TranslocoDirective,
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
        FormErrorDirective,
        NgIf,
        FormFeedbackComponent,
        FormsModule,
        FormDirective,
        FormLabelDirective,
        FormControlDirective,
        MultiSelectComponent,
        CardFooterComponent,
        PermissionDirective
    ],
    templateUrl: './rotations-add.component.html',
    styleUrl: './rotations-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RotationsAddComponent implements OnInit, OnDestroy {

    private readonly RotationsService: RotationsService = inject(RotationsService);
    private readonly TranslocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private router: Router = inject(Router);

    private subscriptions: Subscription = new Subscription();

    public readonly route = inject(ActivatedRoute);
    public errors: GenericValidationError | null = null;
    public post: RotationPost = {} as RotationPost;
    protected containers: SelectKeyValue[] = [];
    protected maps: SelectKeyValue[] = [];

    private cdr = inject(ChangeDetectorRef);

    constructor() {
        this.post = this.getDefaultPost();
    }

    private getDefaultPost(): RotationPost {
        return {
            Rotation: {
                name: '',
                interval: 90,
                container_id: [],
                Map: []
            }
        };
    }

    public ngOnInit() {
        this.loadMaps();
        this.loadContainers();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public submit(): void {
        this.subscriptions.add(this.RotationsService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Data');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['map_module', 'rotations', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/map_module/rotations/index']);
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

    private loadContainers(): void {
        this.subscriptions.add(this.RotationsService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.containers = result.containers;
                this.cdr.markForCheck();
            }))
    }

    private loadMaps(): void {
        this.subscriptions.add(this.RotationsService.loadMaps()
            .subscribe((result: LoadMapsRoot) => {
                this.maps = result.maps;
                this.cdr.markForCheck();
            }))
    }

}
