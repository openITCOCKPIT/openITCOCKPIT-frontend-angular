import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { ServicetemplategroupsService } from '../servicetemplategroups.service';
import {
    LoadContainersRoot,
    LoadServiceTemplatesRoot,
    ServiceTemplateGroupsGetEditRoot,
    ServiceTemplateGroupssGetEditPostServicetemplategroup,
} from '../servicetemplategroups.interface';
import { MultiSelectComponent } from "../../../layouts/primeng/multi-select/multi-select/multi-select.component";
import { SelectComponent } from "../../../layouts/primeng/select/select/select.component";
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-servicetemplategroups-edit',
    imports: [
        BackButtonDirective,
        BadgeComponent,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
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
        MultiSelectComponent,
        SelectComponent
    ],
    templateUrl: './servicetemplategroups-edit.component.html',
    styleUrl: './servicetemplategroups-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicetemplategroupsEditComponent implements OnInit, OnDestroy {
    private readonly subscriptions: Subscription = new Subscription();
    private readonly ServicetemplateGroupsService: ServicetemplategroupsService = inject(ServicetemplategroupsService);
    private readonly router: Router = inject(Router);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    protected servicetemplates: SelectKeyValue[] = [];
    protected containers: SelectKeyValue[] = [];
    protected errors: GenericValidationError = {} as GenericValidationError;
    protected post: ServiceTemplateGroupssGetEditPostServicetemplategroup = {
        container: {
            containertype_id: 0,
            id: 0,
            lft: 0,
            name: '',
            parent_id: 0,
            rght: 0
        },
        container_id: 0,
        created: '',
        description: '',
        id: 0,
        modified: '',
        servicetemplates: {
            _ids: []
        },
        uuid: ''
    }

    public ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        //First, load shit into the component.
        this.loadContainers();
        this.subscriptions.add(this.ServicetemplateGroupsService.getServicetemplategroupEdit(id)
            .subscribe((result: ServiceTemplateGroupsGetEditRoot) => {

                // Then put post where it belongs. Also unpack that bullshit
                this.post = result.servicetemplategroup.Servicetemplategroup;

                // Then force containerChange!
                this.onContainerChange();

                this.cdr.markForCheck();
            }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public updateServicetemplategroup(): void {

        this.subscriptions.add(this.ServicetemplateGroupsService.updateServicetemplategroup(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                this.cdr.markForCheck();

                if (result.success) {
                    const response: GenericIdResponse = result.data as GenericIdResponse;

                    const title: string = this.TranslocoService.translate('Service template group');
                    const msg: string = this.TranslocoService.translate('updated successfully');
                    const url: (string | number)[] = ['servicetemplategroups', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);
                    this.HistoryService.navigateWithFallback(['/servicetemplategroups/index']);

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
        this.subscriptions.add(this.ServicetemplateGroupsService.loadContainers()
            .subscribe((result: LoadContainersRoot): void => {
                this.cdr.markForCheck();
                this.containers = result.containers;
            }))
    }

    public onContainerChange(): void {
        if (this.post.container.parent_id === 0) {
            this.servicetemplates = [];
            return;
        }
        this.loadServicetemplates('');
    }

    /*******************
     * ARROW functions *
     *******************/
    protected loadServicetemplates = (servicetemplateName: string): void => {
        if (!this.post.container.parent_id) {
            this.servicetemplates = [];
            return;
        }
        this.subscriptions.add(this.ServicetemplateGroupsService.loadServicetemplatesByContainerId(this.post.container.parent_id, servicetemplateName, this.post.servicetemplates._ids)
            .subscribe((result: LoadServiceTemplatesRoot): void => {
                this.servicetemplates = result.servicetemplates;
                this.cdr.markForCheck();
            }))
    }
}
