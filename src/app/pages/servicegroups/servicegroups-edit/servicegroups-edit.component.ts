import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    BadgeComponent,
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
    NavComponent,
    NavItemComponent,
    TooltipDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { MacrosComponent } from '../../../components/macros/macros.component';
import { NgForOf, NgIf } from '@angular/common';
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
    Servicegroup,
    ServicegroupsEditGet,
    LoadContainersRoot,
    LoadServicesResponse,
    LoadServicetemplates, ServicesListService
} from "../servicegroups.interface";
import { SelectComponent } from "../../../layouts/primeng/select/select/select.component";
import { MultiSelectComponent } from "../../../layouts/primeng/multi-select/multi-select/multi-select.component";
import { SelectKeyValue } from "../../../layouts/primeng/select.interface";
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-servicegroups-edit',
    standalone: true,
    imports: [
        BackButtonDirective,
        BadgeComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        MacrosComponent,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NgSelectModule,
        PermissionDirective,
        RequiredIconComponent,
        TooltipDirective,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        ObjectUuidComponent,
        SelectComponent,
        MultiSelectComponent,
        FormLoaderComponent
    ],
    templateUrl: './servicegroups-edit.component.html',
    styleUrl: './servicegroups-edit.component.css'
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

    private readonly HistoryService: HistoryService = inject(HistoryService);

    public post: Servicegroup = {
        container: {
            containertype_id: 0,
            id: 0,
            lft: 0,
            name: '',
            parent_id: 0,
            rght: 0,
        },
        container_id: 0,
        description: '',
        servicegroup_url: '',
        services: {
            _ids: []
        },
        servicetemplates: {
            _ids: []
        },
        id: 0,
        uuid: ''
    }
    protected containers: SelectKeyValue[] = [];
    protected servicetemplates: SelectKeyValue[] = [];
    private route = inject(ActivatedRoute);


    public ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        //First, load shit into the component.
        this.loadContainers();
        this.subscriptions.add(this.ServicegroupsService.getEdit(id)
            .subscribe((result: ServicegroupsEditGet) => {

                // Then put post where it belongs. Also unpack that bullshit
                this.post = result.servicegroup.Servicegroup;

                // Then force containerChange!
                this.onContainerChange();
            }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public updateServicegroup(): void {

        this.subscriptions.add(this.ServicegroupsService.updateServicegroup(this.post)
            .subscribe((result: GenericResponseWrapper) => {
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

                    // This is a bit of a hack, but it's the only way to get the error message to show up in the right place.
                    if (typeof this.errors['container']['name'] !== 'undefined') {
                        this.errors['name'] = <any>this.errors['container']['name'];
                    }
                }
            })
        );
    }

    private loadContainers(): void {
        this.subscriptions.add(this.ServicegroupsService.loadContainers()
            .subscribe((result: LoadContainersRoot) => {
                this.containers = result.containers;
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
                this.servicetemplates = result.servicetemplates;
            }))
    }
}
