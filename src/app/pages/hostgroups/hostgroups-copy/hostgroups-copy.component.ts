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
import { HostgroupsService } from '../hostgroups.service';
import { HostgroupsCopyPostResult } from '../hostgroups.interface';
import { GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'oitc-hostgroups-copy',
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
    templateUrl: './hostgroups-copy.component.html',
    styleUrl: './hostgroups-copy.component.css'
})
export class HostgroupsCopyComponent implements OnInit, OnDestroy {
    public hostgroups: HostgroupsCopyPostResult[] = [];
    public errors: GenericValidationError | null = null;
    private subscriptions: Subscription = new Subscription();
    private HostgroupsService: HostgroupsService = inject(HostgroupsService);
    private readonly notyService: NotyService = inject(NotyService);

    private router: Router = inject(Router);
    private route: ActivatedRoute = inject(ActivatedRoute);

    public ngOnInit() {
        const ids = String(this.route.snapshot.paramMap.get('ids')).split(',').map(Number);

        if (!ids) {
            // No ids given
            this.router.navigate(['/', 'hostgroups', 'index']);
            return;
        }

        this.subscriptions.add(this.HostgroupsService.getHostgroupsCopy(ids).subscribe((hostgroups) => {
            for (let hostgroup of hostgroups) {
                this.hostgroups.push({
                    Hostgroup: {
                        container: {
                            name: hostgroup.container.name,
                        },
                        description: hostgroup.description,
                    },
                    Source: {
                        id: hostgroup.id,
                        name: hostgroup.container.name
                    },
                    Error: null
                } as HostgroupsCopyPostResult);
            }
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public copyHostgroups() {
        this.subscriptions.add(
            this.HostgroupsService.saveHostgroupsCopy(this.hostgroups).subscribe({
                next: (value: any) => {
                    this.notyService.genericSuccess();
                    this.router.navigate(['/', 'hostgroups', 'index']);
                },
                error: (error: HttpErrorResponse) => {
                    this.notyService.genericError();
                    this.hostgroups = error.error.result as HostgroupsCopyPostResult[];
                    this.hostgroups.forEach((hostgroup: HostgroupsCopyPostResult) => {
                        if (!hostgroup.Error) {
                            return;
                        }
                        if (hostgroup.Error?.['container']['name'] !== 'undefined') {
                            hostgroup.Error['name'] = <any>hostgroup.Error?.['container']['name'];
                        }
                    });
                }
            })
        );
    }
}

