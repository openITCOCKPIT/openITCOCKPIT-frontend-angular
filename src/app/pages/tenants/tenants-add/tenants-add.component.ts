import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TenantPost } from '../tenant.interface';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { TenantsService } from '../tenants.service';
import { HistoryService } from '../../../history.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
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
    FormLabelDirective,
    NavComponent,
    NavItemComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';


import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'oitc-tenants-add',
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
    PermissionDirective,
    ReactiveFormsModule,
    RequiredIconComponent,
    TranslocoDirective,
    XsButtonDirective,
    RouterLink
],
    templateUrl: './tenants-add.component.html',
    styleUrl: './tenants-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantsAddComponent implements OnInit, OnDestroy {

    public createAnother: boolean = false;
    public post: TenantPost = this.getDefaultPost();
    public errors: GenericValidationError | null = null;


    private subscriptions: Subscription = new Subscription();
    private readonly TenantsService = inject(TenantsService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getDefaultPost(): TenantPost {
        return {
            description: '',
            is_active: 1,
            number_users: 0,
            max_users: 0,
            number_hosts: 0,
            number_services: 0,
            firstname: '',
            lastname: '',
            street: '',
            zipcode: null,
            city: '',
            container: {
                name: '',
            }
        }
    }

    public submit() {
        this.subscriptions.add(this.TenantsService.add(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Tenant');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['tenants', 'edit', response.id];

                    this.notyService.genericSuccess(msg, title, url);

                    if (!this.createAnother) {
                        this.HistoryService.navigateWithFallback(['/tenants/index']);
                        return;
                    }
                    this.post = this.getDefaultPost();
                    this.notyService.scrollContentDivToTop();
                    this.errors = null;
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            }));
    }
}
