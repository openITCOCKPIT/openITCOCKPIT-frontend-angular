import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormLabelDirective,
    NavComponent
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { NgForOf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
    ServiceTemplateGroupsGetCopyGetServicetemplategroup,
    ServiceTemplateGroupsGetCopyPostData,
} from '../servicetemplategroups.interface';
import { ServicetemplategroupsService } from '../servicetemplategroups.service';
import { ContactgroupsCopyPost } from '../../contactgroups/contactgroups.interface';

@Component({
    selector: 'oitc-servicetemplategroups-copy',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        NavComponent,
        NgForOf,
        PermissionDirective,
        ReactiveFormsModule,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        FormsModule
    ],
    templateUrl: './servicetemplategroups-copy.component.html',
    styleUrl: './servicetemplategroups-copy.component.css'
})
export class ServicetemplategroupsCopyComponent implements OnInit, OnDestroy {
    public servicetemplategroups: ServiceTemplateGroupsGetCopyPostData[] = [];
    public errors: GenericValidationError | null = null;
    private subscriptions: Subscription = new Subscription();
    private ServicetemplategroupsService: ServicetemplategroupsService = inject(ServicetemplategroupsService);
    private readonly notyService: NotyService = inject(NotyService);

    private router: Router = inject(Router);
    private route: ActivatedRoute = inject(ActivatedRoute);

    public ngOnInit() {
        const ids = String(this.route.snapshot.paramMap.get('ids')).split(',').map(Number);

        if (!ids) {
            // No ids given
            this.router.navigate(['/', 'servicetemplategroups', 'index']);
            return;
        }

        this.subscriptions.add(this.ServicetemplategroupsService.getServicetemplategroupsCopy(ids).subscribe((servicetemplategroups: ServiceTemplateGroupsGetCopyGetServicetemplategroup[]) => {
            for (let servicetemplategroup of servicetemplategroups) {
                this.servicetemplategroups.push({
                    Servicetemplategroup: {
                        container: {
                            name: servicetemplategroup.container.name
                        },
                        description: servicetemplategroup.description,
                    },
                    Source: {
                        id: servicetemplategroup.id,
                        name: servicetemplategroup.container.name
                    },
                    Error: null
                });
            }
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public copyServicetemplategroups() {
        this.subscriptions.add(
            this.ServicetemplategroupsService.saveServicetemplategroupsCopy(this.servicetemplategroups).subscribe({
                next: (value: any) => {
                    this.notyService.genericSuccess();
                    this.router.navigate(['/', 'servicetemplategroups', 'index']);
                },
                error: (error: HttpErrorResponse) => {
                    this.notyService.genericError();
                    this.servicetemplategroups = error.error.result as ServiceTemplateGroupsGetCopyPostData[];
                    this.servicetemplategroups.forEach((serviceTemplateGroup: ServiceTemplateGroupsGetCopyPostData) => {
                        if (!serviceTemplateGroup.Error) {
                            return;
                        }
                        if (serviceTemplateGroup.Error?.['container']['name'] !== 'undefined') {
                            serviceTemplateGroup.Error['name'] = <any>serviceTemplateGroup.Error?.['container']['name'];
                        }
                    });
                }
            })
        );
    }
}
