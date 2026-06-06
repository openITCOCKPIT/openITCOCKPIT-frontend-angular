import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MapgeneratorsService } from '../mapgenerators.service';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { HistoryService } from '../../../../../history.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { MapgeneratorPost } from '../mapgenerators.interface';
import { LoadContainersRoot } from '../../../../../pages/containers/containers.interface';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TextColorDirective,
    TooltipDirective,
} from '@coreui/angular';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { NgClass } from '@angular/common';
import { MapgeneratorTypes } from '../mapgenerator-types';

@Component({
    selector: 'oitc-mapgenerators-add',
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
        MultiSelectComponent,
        NavComponent,
        NavItemComponent,
        PermissionDirective,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        SelectComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        NgClass,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        ColComponent,
        RowComponent,
        TextColorDirective,
        TooltipDirective
    ],
    templateUrl: './mapgenerators-add.component.html',
    styleUrl: './mapgenerators-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapgeneratorsAddComponent implements OnInit, OnDestroy {

    private readonly MapgeneratorsService: MapgeneratorsService = inject(MapgeneratorsService);
    private readonly TranslocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    private subscriptions: Subscription = new Subscription();

    public readonly route = inject(ActivatedRoute);
    public errors: GenericValidationError | null = null;
    protected containers: SelectKeyValue[] = [];
    protected types: SelectKeyValue[] = [
        {key: 1, value: this.TranslocoService.translate('Container Structure')},
        {key: 2, value: this.TranslocoService.translate('Hostname Splitting')}
    ];

    public missingContainerLevel = false;
    public post = this.getDefaultPost();

    public dividerPlaceholder = this.TranslocoService.translate('Divider (e.g. -)');
    protected mapgeneratorLevelIsContainerIndex: number = 0;

    protected readonly MapgeneratorTypes = MapgeneratorTypes;

    private cdr = inject(ChangeDetectorRef);

    private getDefaultPost(): MapgeneratorPost {
        return {
            name: '',
            description: '',
            map_refresh_interval: 90,
            type: 1,
            items_per_line: 10,
            containers: {
                _ids: []
            },
            mapgenerator_levels: [
                {
                    id: 1,
                    name: '',
                    divider: '',
                    is_container: 1
                },
                {
                    id: 2,
                    name: '',
                    divider: '',
                    is_container: 0
                }
            ]
        };
    }

    ngOnInit(): void {
        this.loadContainers();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public submit(): void {
        this.errors = null;
        this.missingContainerLevel = false;

        if (this.post.type === MapgeneratorTypes.GENERATE_BY_HOSTNAME_SPLITTING) {
            this.post.containers = {_ids: []};
            this.updateMapgeneratorLevels();
        }

        this.subscriptions.add(this.MapgeneratorsService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Data');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['map_module', 'mapgenerators', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/map_module/mapgenerators/index']);
                    return;
                }
                this.cdr.markForCheck();

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                    if (this.errors.hasOwnProperty('validate_levels_is_container')) {
                        this.missingContainerLevel = true;
                    }
                }
                this.cdr.markForCheck();
            }))
    }

    private loadContainers(): void {
        this.subscriptions.add(this.MapgeneratorsService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.containers = result.containers;
                this.cdr.markForCheck();
            }))
    }

    public addLevel() {
        let count = this.post.mapgenerator_levels.length + 1;

        this.post.mapgenerator_levels

        this.post.mapgenerator_levels.push({
            id: count,
            name: "",
            divider: "",
            is_container: 0
        });

        this.cdr.markForCheck();
    }

    public removeLevel(index: any) {
        this.post.mapgenerator_levels.splice(index, 1);
        this.updateMapgeneratorLevels();
        this.removeErrorIfExists(index, 'validate_levels');
        this.cdr.markForCheck();
    }

    private removeErrorIfExists(index: number, errorKey: string) {
        if (this.errors) {
            if (this.errors.hasOwnProperty(errorKey) && this.errors[errorKey].hasOwnProperty(index)) {
                if (Array.isArray(this.errors[errorKey])) {
                    // CakePHP returns an array bacuase the index with the error starts at 0
                    this.errors[errorKey].splice(index, 1);
                } else {
                    // CakePHP returns an array bacuase the index with the error starts at is > 0
                    delete this.errors[errorKey][index];
                }
            }

            // Reduce all indexes > index by 1
            // If a user remove an element with error above other elements
            const newErrors: GenericValidationError = {};
            for (const key in this.errors[errorKey]) {
                let numericKey = Number(key);
                if (numericKey > index) {
                    numericKey = numericKey - 1;
                }
                if (!newErrors.hasOwnProperty(errorKey)) {
                    newErrors[errorKey] = {};
                }

                newErrors[errorKey][numericKey] = this.errors[errorKey][key];
            }

            this.errors[errorKey] = newErrors[errorKey];

            this.errors = structuredClone(this.errors); // get new reference to trigger change detection if signals
            this.cdr.markForCheck();
        }
    }

    public getLevelPlaceholder(index: number, isLastLevel: boolean) {
        if (isLastLevel) {
            return this.TranslocoService.translate('Name (e.g. Host)');
        }
        return this.TranslocoService.translate('Name (e.g. Level {0})', {'0': (index + 1).toString()});
    }

    public onTypeChange(): void {
        switch (this.post.type) {
            case MapgeneratorTypes.GENERATE_BY_HOSTNAME_SPLITTING:
                this.post.containers = {_ids: []};
                this.post.mapgenerator_levels = [
                    {
                        id: 1,
                        name: '',
                        divider: '',
                        is_container: 1
                    },
                    {
                        id: 2,
                        name: '',
                        divider: '',
                        is_container: 0
                    }
                ];
                this.cdr.markForCheck();
                break;
            default:
                this.post.mapgenerator_levels = [];
                break;
        }
        this.cdr.markForCheck();
    }

    public updateMapgeneratorLevels() {
        this.post.mapgenerator_levels.map(
            item => item.is_container = 0
        );
        if (this.mapgeneratorLevelIsContainerIndex >= (this.post.mapgenerator_levels.length - 1)) {
            this.mapgeneratorLevelIsContainerIndex = this.mapgeneratorLevelIsContainerIndex - 1;
            this.cdr.markForCheck();
        }
        if (this.post.mapgenerator_levels[this.mapgeneratorLevelIsContainerIndex]) {
            this.post.mapgenerator_levels[this.mapgeneratorLevelIsContainerIndex].is_container = 1;
        }
        this.cdr.markForCheck();

    }
}
