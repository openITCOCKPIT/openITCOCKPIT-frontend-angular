import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
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
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';

import { NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ObjectUuidComponent } from '../../../layouts/coreui/object-uuid/object-uuid.component';
import { ServicegroupsService } from '../servicegroups.service';
import {
    LoadContainersRoot,
    LoadServicesResponse,
    LoadServicetemplates,
    Servicegroup,
    ServicegroupsEditGet,
    ServicesListService
} from "../servicegroups.interface";
import { SelectComponent } from "../../../layouts/primeng/select/select/select.component";
import { MultiSelectComponent } from "../../../layouts/primeng/multi-select/multi-select/multi-select.component";
import { SelectKeyValue } from "../../../layouts/primeng/select.interface";
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../history.service';
import {
    MultiSelectOptgroupComponent
} from '../../../layouts/primeng/multi-select/multi-select-optgroup/multi-select-optgroup.component';

@Component({
    selector: 'oitc-servicegroups-edit',
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
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        ObjectUuidComponent,
        SelectComponent,
        MultiSelectComponent,
        FormLoaderComponent,
        MultiSelectOptgroupComponent
    ],
    templateUrl: './servicegroups-edit.component.html',
    styleUrl: './servicegroups-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicegroupsEditComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription = new Subscription();
    private ServicegroupsService: ServicegroupsService = inject(ServicegroupsService);
    protected services: ServicesListService[] = [];
    private router: Router = inject(Router);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    public errors: GenericValidationError | null = null;
    public createAnother: boolean = false;
    private cdr = inject(ChangeDetectorRef);

    private readonly HistoryService: HistoryService = inject(HistoryService);

    public post!: Servicegroup;
    protected containers: SelectKeyValue[] = [];
    protected servicetemplates: SelectKeyValue[] = [];
    private route = inject(ActivatedRoute);


    public ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadContainers();
        this.subscriptions.add(this.ServicegroupsService.getEdit(id)
            .subscribe((result: ServicegroupsEditGet) => {

                this.post = result.servicegroup.Servicegroup;

                // Then force containerChange!
                this.onContainerChange();
                this.cdr.markForCheck();
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public updateServicegroup(): void {

        this.subscriptions.add(this.ServicegroupsService.updateServicegroup(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response: GenericIdResponse = result.data as GenericIdResponse;

                    const title: string = this.TranslocoService.translate('Servicegroup');
                    const msg: string = this.TranslocoService.translate('updated successfully');
                    const url: (string | number)[] = ['servicegroups', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/servicegroups/index']);
                        return;
                    }
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
