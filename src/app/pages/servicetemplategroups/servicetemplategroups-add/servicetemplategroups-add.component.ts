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
    FormControlDirective, FormDirective, FormLabelDirective, NavComponent, NavItemComponent, TooltipDirective
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
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericIdResponse, GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ObjectUuidComponent } from '../../../layouts/coreui/object-uuid/object-uuid.component';
import { ServicetemplategroupsService } from '../servicetemplategroups.service';
import {
    LoadContainersContainer,
    LoadContainersRoot,
    LoadServiceTemplatesRoot, LoadServiceTemplatesServicetemplate,
    ServiceTemplateGroupsAddPostServicetemplategroup
} from '../servicetemplategroups.interface';

@Component({
    selector: 'oitc-servicetemplategroups-add',
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
        ObjectUuidComponent
    ],
    templateUrl: './servicetemplategroups-add.component.html',
    styleUrl: './servicetemplategroups-add.component.css'
})
export class ServicetemplategroupsAddComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription = new Subscription();
    private ServicetemplategroupsService: ServicetemplategroupsService = inject(ServicetemplategroupsService);
    private router: Router = inject(Router);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService:NotyService = inject(NotyService);
    public errors: GenericValidationError = {} as GenericValidationError;
    public createAnother: boolean = false;

    protected servicetemplates: LoadServiceTemplatesServicetemplate[] = [];

    public post: ServiceTemplateGroupsAddPostServicetemplategroup = {} as ServiceTemplateGroupsAddPostServicetemplategroup;
    protected containers: LoadContainersContainer[] = [];
    private route = inject(ActivatedRoute)

    constructor() {
        this.post = this.getDefaultPost();
    }

    public ngOnInit() {
        //First, load shit into the component.
        this.loadContainers();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public addServicetemplategroup(): void {

        this.subscriptions.add(this.ServicetemplategroupsService.addServicetemplateGroup(this.post)
            .subscribe((result: GenericResponseWrapper) => {
                if (result.success) {
                    const response: GenericIdResponse = result.data as GenericIdResponse;

                    const title: string = this.TranslocoService.translate('Service template group');
                    const msg: string = this.TranslocoService.translate('added successfully');
                    const url: (string | number)[] = ['servicetemplategroups', 'edit', response.id];

                    if (this.createAnother) {
                        this.post = this.getDefaultPost();
                        return;
                    }
                    this.notyService.genericSuccess(msg, title, url);
                    this.router.navigate(['/servicetemplategroups/index']);

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
        this.subscriptions.add(this.ServicetemplategroupsService.loadContainers()
            .subscribe((result: LoadContainersRoot): void => {
                this.containers = result.containers;
            }))
    }

    private getDefaultPost(): ServiceTemplateGroupsAddPostServicetemplategroup {
        return {
            container: {
                name: '',
                parent_id: null
            },
            description: '',
            servicetemplates: {
                _ids: []
            }
        }
    }

    private loadServicetemplates(): void {
        if (!this.post.container.parent_id) {
            this.servicetemplates = [];
            return;
        }
        this.subscriptions.add(this.ServicetemplategroupsService.loadServicetemplatesByContainerId(this.post.container.parent_id)
            .subscribe((result: LoadServiceTemplatesRoot): void => {
                this.servicetemplates = result.servicetemplates;
            }))
    }


    public onContainerChange(): void {
        if (!this.post.container.parent_id) {
            this.servicetemplates = [];
            return;
        }
        this.loadServicetemplates();
    }
}
