import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckInputDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective, InputGroupComponent,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';

import { NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';

import { ServicegroupsService } from '../servicegroups.service';
import {
    LoadContainersRoot,
    LoadServicesResponse,
    LoadServicetemplates,
    Servicegroup,
    ServicesListService
} from "../servicegroups.interface";
import { SelectComponent } from "../../../layouts/primeng/select/select/select.component";
import { MultiSelectComponent } from "../../../layouts/primeng/multi-select/multi-select/multi-select.component";
import { SelectKeyValue } from "../../../layouts/primeng/select.interface";
import { HistoryService } from '../../../history.service';
import {
    MultiSelectOptgroupComponent
} from '../../../layouts/primeng/multi-select/multi-select-optgroup/multi-select-optgroup.component';

@Component({
    selector: 'oitc-servicegroups-add',
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        FormCheckInputDirective,
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
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        SelectComponent,
        MultiSelectComponent,
        MultiSelectOptgroupComponent,
        InputGroupComponent,
        TranslocoPipe
    ],
    templateUrl: './servicegroups-add.component.html',
    styleUrl: './servicegroups-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicegroupsAddComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly ServicegroupsService: ServicegroupsService = inject(ServicegroupsService);
    private readonly router: Router = inject(Router);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly route = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly cdr = inject(ChangeDetectorRef);

    protected errors: GenericValidationError | null = null;
    protected createAnother: boolean = false;
    protected post: Servicegroup = this.getDefaultPost();
    protected preselectedServiceIds: number[] = [];

    protected services: ServicesListService[] = [];
    protected containers: SelectKeyValue[] = [];
    protected servicetemplates: SelectKeyValue[] = [];
    public tagsForSelect: string[] = [];


    constructor() {
        const serviceIds = this.route.snapshot.paramMap.get('serviceids');
        if (serviceIds) {
            this.preselectedServiceIds = serviceIds.split(',').map(Number);
        }
    }

    public ngOnInit() {
        // Load containers for dropdown.
        this.loadContainers();

        // Force services and servicetemplates empty if you "create another".
        this.loadServices('');
        this.loadServicetemplates('');
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public submit(): void {
        this.post.tags = this.tagsForSelect.join(',');
        this.subscriptions.add(this.ServicegroupsService.addServicegroup(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();

                if (result.success) {
                    const response: GenericIdResponse = result.data as GenericIdResponse;

                    const title: string = this.TranslocoService.translate('Servicegroup');
                    const msg: string = this.TranslocoService.translate('added successfully');
                    const url: (string | number)[] = ['servicegroups', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/servicegroups/index']);
                        return;
                    }
                    this.post = this.getDefaultPost();
                    this.errors = null;
                    this.ngOnInit();
                    this.notyService.scrollContentDivToTop();

                    return;
                }

                // Error
                this.notyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;
                }
            })
        );
    }

    private loadContainers(): void {
        this.subscriptions.add(this.ServicegroupsService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.containers = result.containers;
                this.cdr.markForCheck();
            }))
    }

    private getDefaultPost(): Servicegroup {
        return {
            container: {
                name: '',
                parent_id: 0
            },
            description: "",
            servicegroup_url: "",
            tags: "",
            services: {
                _ids: []
            },
            servicetemplates: {
                _ids: []
            }
        }
    }


    public onContainerChange(): void {
        if (!this.post.container.parent_id) {
            this.services = [];
            return;
        }
        this.loadServices('');
        this.loadServicetemplates('');
    }

    // ARROW FUNCTIONS
    protected loadServices = (search: string) => {
        if (!this.post.container.parent_id) {
            this.services = [];
            return;
        }
        if (this.preselectedServiceIds.length > 0) {
            this.post.services._ids = this.preselectedServiceIds;
        }
        this.subscriptions.add(this.ServicegroupsService.loadServices(this.post.container.parent_id, search, this.post.services._ids)
            .subscribe((result: LoadServicesResponse) => {
                this.cdr.markForCheck();
                this.services = result.services;
            }))
    }


    protected loadServicetemplates = (search: string) => {
        if (!this.post.container.parent_id) {
            this.servicetemplates = [];
            return;
        }
        this.subscriptions.add(this.ServicegroupsService.loadServicetemplates(this.post.container.parent_id, search, this.post.servicetemplates._ids)
            .subscribe((result: LoadServicetemplates) => {
                this.cdr.markForCheck();

                this.servicetemplates = result.servicetemplates;
            }))
    }
}
