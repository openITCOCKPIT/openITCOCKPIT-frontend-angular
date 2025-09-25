import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { MapgeneratorsService } from '../mapgenerators.service';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { HistoryService } from '../../../../../history.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { InternalLevel, Mapgenerator, MapgeneratorPost } from '../mapgenerators.interface';
import { LoadContainersRoot } from '../../../../../pages/containers/containers.interface';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
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
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { NgClass } from '@angular/common';
import _ from 'lodash';
import { MapgeneratorTypes } from '../mapgenerator-types';

@Component({
    selector: 'oitc-mapgenerators-edit',
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
        FormLoaderComponent,
        SelectComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        NgClass
    ],
    templateUrl: './mapgenerators-edit.component.html',
    styleUrl: './mapgenerators-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapgeneratorsEditComponent implements OnInit, OnDestroy {

    private readonly MapgeneratorsService: MapgeneratorsService = inject(MapgeneratorsService);
    private readonly TranslocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private router: Router = inject(Router);

    private subscriptions: Subscription = new Subscription();

    public readonly route = inject(ActivatedRoute);
    public errors: GenericValidationError | null = null;
    public post: MapgeneratorPost = {} as MapgeneratorPost;
    protected containers: SelectKeyValue[] = [];
    protected types: SelectKeyValue[] = [
        {key: 1, value: this.TranslocoService.translate('Container Structure')},
        {key: 2, value: this.TranslocoService.translate('Hostname Splitting')}
    ];

    public mapgenerator: { levels: InternalLevel[] } = {
        levels: [
            {
                id: 1,
                name: '',
                divider: '',
                is_container: true,
                index: 0
            },
            {
                id: 2,
                name: '',
                divider: '',
                is_container: false,
                index: 1
            }
        ]
    };

    public dividerPlaceholder = this.TranslocoService.translate('Divider (e.g. -)');
    protected mapgeneratorLevelIsContainerIndex: number | null = 0;

    protected readonly MapgeneratorTypes = MapgeneratorTypes;

    private cdr = inject(ChangeDetectorRef);

    protected mapgeneratorId: number = 0;

    constructor() {
        this.post = this.getDefaultPost();
    }

    private getDefaultPost(): MapgeneratorPost {
        return {
            Mapgenerator: {
                name: '',
                description: '',
                map_refresh_interval: 90,
                type: 1,
                items_per_line: 10,
                containers: {
                    _ids: []
                },
                mapgenerator_levels: []
            }
        };
    }

    ngOnInit(): void {
        this.mapgeneratorId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadContainers();
        this.load();
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private load() {
        this.subscriptions.add(this.MapgeneratorsService.getEdit(this.mapgeneratorId)
            .subscribe((result) => {
                this.cdr.markForCheck();
                const mapgenerator: Mapgenerator = result.mapgenerator;
                let selectedContainer = [];

                for (let key in mapgenerator.containers) {
                    selectedContainer.push(parseInt(String(mapgenerator.containers[key].id), 10));
                }

                this.post.Mapgenerator.containers._ids = mapgenerator.containers.map(container => container.id);
                this.post.Mapgenerator.name = mapgenerator.name;
                this.post.Mapgenerator.description = mapgenerator.description;
                this.post.Mapgenerator.map_refresh_interval = (parseInt(mapgenerator.map_refresh_interval.toString(), 10) / 1000);
                this.post.Mapgenerator.type = mapgenerator.type;
                this.post.Mapgenerator.items_per_line = mapgenerator.items_per_line;

                if (this.post.Mapgenerator.type === MapgeneratorTypes.GENERATE_BY_HOSTNAME_SPLITTING && mapgenerator.mapgenerator_levels && mapgenerator.mapgenerator_levels.length > 0) {
                    this.post.Mapgenerator.mapgenerator_levels = mapgenerator.mapgenerator_levels;
                    this.mapgenerator.levels = [];

                    for (let key in this.post.Mapgenerator.mapgenerator_levels) {
                        this.mapgenerator.levels.push({
                            id: <number>this.post.Mapgenerator.mapgenerator_levels[key].id,
                            name: this.post.Mapgenerator.mapgenerator_levels[key].name,
                            divider: this.post.Mapgenerator.mapgenerator_levels[key].divider,
                            is_container: this.post.Mapgenerator.mapgenerator_levels[key].is_container,
                            index: Number(key)
                        });
                        if (this.post.Mapgenerator.mapgenerator_levels[key].is_container) {
                            this.mapgeneratorLevelIsContainerIndex = Number(key);
                        }
                    }

                    this.mapgenerator.levels = _(this.mapgenerator.levels)
                        .chain()
                        .flatten()
                        .sortBy('id')
                        .value();
                }

            }));
    }

    public updateMapgenerator(): void {

        let index = 0;
        this.post.Mapgenerator.mapgenerator_levels = [];

        if (this.post.Mapgenerator.type === MapgeneratorTypes.GENERATE_BY_HOSTNAME_SPLITTING) {
            for (let i in this.mapgenerator.levels) {

                let is_container = false;
                if (this.mapgeneratorLevelIsContainerIndex !== null && i === String(this.mapgeneratorLevelIsContainerIndex)) {
                    is_container = true;
                }

                this.post.Mapgenerator.mapgenerator_levels[index] = {
                    'id': this.mapgenerator.levels[i].id,
                    'name': this.mapgenerator.levels[i].name,
                    'divider': this.mapgenerator.levels[i].divider,
                    'is_container': is_container
                };
                index++;
            }
        }

        this.subscriptions.add(this.MapgeneratorsService.updateMapgenerator(this.post, this.mapgeneratorId)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Data');
                    const msg = this.TranslocoService.translate('updated successfully');
                    const url = ['map_module', 'mapgenerators', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/map_module/mapgenerators/index']);
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

        this.subscriptions.add(this.MapgeneratorsService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.containers = result.containers;
                this.cdr.markForCheck();
            }))
    }

    public addLevel() {
        let count = this.mapgenerator.levels.length + 1;

        this.mapgenerator.levels.push({
            id: null,
            name: "",
            divider: "",
            is_container: false,
            index: Object.keys(this.mapgenerator.levels).length
        });

        if (this.errors && (typeof this.errors['validate_levels'] !== 'undefined' ||
            typeof this.errors['mapgenerator_levels'] !== 'undefined')) {
            this.mapgenerator.levels = this.mapgenerator.levels;
        } else {
            this.mapgenerator.levels = _(this.mapgenerator.levels)
                .chain()
                .flatten()
                .sortBy('id')
                .value();
        }
        this.cdr.markForCheck();
    }

    public removeLevel(levelIndex: any) {
        let mapgeneratorLevels = [];
        for (let i in this.mapgenerator.levels) {
            if (this.mapgenerator.levels[i]['index'] !== levelIndex) {
                this.mapgenerator.levels[i]['index'] = mapgeneratorLevels.length;
                mapgeneratorLevels.push(this.mapgenerator.levels[i])
            }
        }
        if (this.errors && (typeof this.errors['validate_levels'] !== 'undefined' ||
            typeof this.errors['mapgenerator_levels'] !== 'undefined')) {
            this.mapgenerator.levels = mapgeneratorLevels;
        } else {
            this.mapgenerator.levels = _(mapgeneratorLevels)
                .chain()
                .flatten()
                .sortBy('id')
                .value();
        }

        this.mapgeneratorLevelIsContainerIndex = null;
        this.cdr.markForCheck();
    };

    public getMapgeneratorLevelErrors(index: number, validationKeyName: string, keyName: string): string[] {
        if (this.errors && this.errors[validationKeyName] && this.errors[validationKeyName][index]) {
            let levels = <any>this.errors[validationKeyName][index];
            if (levels && levels[keyName]) {
                return Object.keys(levels[keyName]).map((key) => levels[keyName][key]);
            }
            return [];
        } else {
            return [];
        }

    }

    public getLevelPlaceholder(index: number, isLastLevel: boolean) {

        if (isLastLevel) {
            return this.TranslocoService.translate('Name (e.g. Host)');
        }

        return this.TranslocoService.translate('Name (e.g. Level {0})', {'0': (index + 1).toString()});

    }

    public onTypeChange(): void {
        switch (this.post.Mapgenerator.type) {
            case MapgeneratorTypes.GENERATE_BY_HOSTNAME_SPLITTING:
                this.post.Mapgenerator.containers = {_ids: []};
                break;
            default:
                this.post.Mapgenerator.mapgenerator_levels = [];
                this.mapgenerator = {
                    levels: [
                        {
                            id: 1,
                            name: '',
                            divider: '',
                            is_container: true,
                            index: 0
                        },
                        {
                            id: 2,
                            name: '',
                            divider: '',
                            is_container: false,
                            index: 1
                        }
                    ]
                }
                break;
        }
        this.cdr.markForCheck();
    }

}
