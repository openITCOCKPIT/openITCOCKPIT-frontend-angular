import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { SelectKeyValue } from "../../../../../layouts/primeng/select.interface";
import { HistoryService } from '../../../../../history.service';


import { PermissionsService } from '../../../../../permissions/permissions.service';
import { LoadContainersRoot } from '../../../../../pages/containers/containers.interface';
import { RotationsService } from '../rotations.service';
import { LoadMapsRoot, Rotation, RotationPost } from '../rotations.interface';

@Component({
    selector: 'oitc-rotations-edit',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        NgIf,
        NgSelectModule,
        PermissionDirective,
        RequiredIconComponent,
        RouterLink,
        TranslocoDirective,
        XsButtonDirective,
        MultiSelectComponent,
        FormLoaderComponent
    ],
    templateUrl: './rotations-edit.component.html',
    styleUrl: './rotations-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RotationsEditComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription = new Subscription();
    private RotationsService: RotationsService = inject(RotationsService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    public errors: GenericValidationError = {} as GenericValidationError;

    public post: RotationPost = {
        Rotation: {
            name: '',
            interval: 90,
            container_id: [],
            Map: []
        }
    };

    protected containers: SelectKeyValue[] = [];
    protected maps: SelectKeyValue[] = [];

    private route = inject(ActivatedRoute);

    protected rotationId: number = 0;
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);
    private rotation!: Rotation;

    public ngOnInit() {
        this.rotationId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadContainers();
        this.loadMaps();
        this.load();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    private load() {
        this.subscriptions.add(this.RotationsService.getEdit(this.rotationId)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.rotation = result.rotation;
                let selectedContainer = [];
                let selectedMaps = [];

                for (let key in this.rotation.containers) {
                    selectedContainer.push(parseInt(String(this.rotation.containers[key].id), 10));
                }

                for (let key in this.rotation.maps) {
                    selectedMaps.push(parseInt(String(this.rotation.maps[key].id), 10));
                }

                this.post.Rotation.container_id = selectedContainer;
                this.post.Rotation.Map = selectedMaps;
                this.post.Rotation.name = this.rotation.name;
                this.post.Rotation.interval = parseInt(String(this.rotation.interval), 10);
            }));
    }

    public updateRotation(): void {

        this.subscriptions.add(this.RotationsService.updateRotation(this.post, this.rotationId)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response: GenericIdResponse = result.data as GenericIdResponse;

                    const title: string = this.TranslocoService.translate('Data');
                    const msg: string = this.TranslocoService.translate('updated successfully');
                    const url: (string | number)[] = ['map_module', 'rotations', 'edit', response.id];

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
            })
        );
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
