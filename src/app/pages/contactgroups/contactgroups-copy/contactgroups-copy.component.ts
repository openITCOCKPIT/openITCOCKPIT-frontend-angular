import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective, FormControlDirective, FormLabelDirective, NavComponent
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
import { ContactgroupsService } from '../contactgroups.service';
import {
    ContactgroupsCopyPost
} from '../contactgroups.interface';
import { GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { HostgroupsCopyPostResult } from '../../hostgroups/hostgroups.interface';

@Component({
    selector: 'oitc-contactgroups-copy',
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
    templateUrl: './contactgroups-copy.component.html',
    styleUrl: './contactgroups-copy.component.css'
})
export class ContactgroupsCopyComponent implements OnInit, OnDestroy {
    public contactgroups: ContactgroupsCopyPost[] = [];
    public errors: GenericValidationError | null = null;
    private subscriptions: Subscription = new Subscription();
    private ContactgroupsService: ContactgroupsService = inject(ContactgroupsService);
    private readonly notyService: NotyService = inject(NotyService);

    private router: Router = inject(Router);
    private route: ActivatedRoute = inject(ActivatedRoute);

    public ngOnInit() {
        const ids = String(this.route.snapshot.paramMap.get('ids')).split(',').map(Number);

        if (!ids) {
            // No ids given
            this.router.navigate(['/', 'contactgroups', 'index']);
            return;
        }

        this.subscriptions.add(this.ContactgroupsService.getContactgroupsCopy(ids).subscribe((contactgroups) => {
            for (let contactgroup of contactgroups) {
                this.contactgroups.push({
                    Contactgroup: {
                        container: {
                            name: contactgroup.Container.name,
                        },
                        description: contactgroup.Contactgroup.description,
                    },
                    Source: {
                        id: contactgroup.Contactgroup.id,
                        name: contactgroup.Container.name
                    },
                    Error: null
                });
            }
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public copyContactgroups() {
        this.subscriptions.add(
            this.ContactgroupsService.saveContactgroupsCopy(this.contactgroups).subscribe({
                next: (value: any) => {
                    this.notyService.genericSuccess();
                    this.router.navigate(['/', 'contactgroups', 'index']);
                },
                error: (error: HttpErrorResponse) => {
                    this.contactgroups = error.error.result as ContactgroupsCopyPost[];
                    this.contactgroups.forEach((copyPostResult: ContactgroupsCopyPost) => {
                        if (!copyPostResult.Error) {
                            return;
                        }
                        if (copyPostResult.Error?.['container']['name'] !== 'undefined') {
                            copyPostResult.Error['name'] = <any>copyPostResult.Error?.['container']['name'];
                        }
                    });
                }
            })
        );
    }
}
