import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { RegistersService } from '../registers.service';
import { NgIf } from '@angular/common';
import { LicenseResponse } from '../registers.interface';
import { CreditsComponent } from '../credits/credits.component';

@Component({
    selector: 'oitc-registers-index',
    standalone: true,
    imports: [
        CoreuiComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        NavComponent,
        NavItemComponent,
        XsButtonDirective,
        FormDirective,
        FormsModule,
        ReactiveFormsModule,
        CardBodyComponent,
        CardFooterComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        RowComponent,
        ColComponent,
        NgIf,
        CreditsComponent
    ],
    templateUrl: './registers-index.component.html',
    styleUrl: './registers-index.component.css'
})
export class RegistersIndexComponent implements OnInit, OnDestroy {

    public license_key: string = ''
    public LicenseResponse: LicenseResponse | null = null;
    public valid: boolean = false;
    public license_type: string = 'community';

    private subscriptions: Subscription = new Subscription();

    private readonly notyService = inject(NotyService);
    private readonly RegistersService = inject(RegistersService);
    private readonly TranslocoService = inject(TranslocoService);

    public ngOnInit() {
        this.loadLicense();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadLicense() {
        this.subscriptions.add(
            this.RegistersService.getLicense().subscribe((response) => {
                if (response.hasLicense && response.license) {
                    this.valid = response.hasLicense;
                    this.LicenseResponse = response.licenseResponse;
                    this.license_key = response.license.license;
                    this.license_type = response.isCommunityLicense ? 'community' : 'enterprise';
                }
            })
        );
    }

    public submit() {
        this.subscriptions.add(
            this.RegistersService.saveLicense(this.license_key)
                .subscribe((result) => {
                    this.valid = false;
                    if (!result) {
                        this.notyService.genericError();
                        return;
                    }

                    if (!result.licenseResponse.success) {
                        this.notyService.genericError(result.licenseResponse.error);
                        return;
                    }

                    let msg = this.TranslocoService.translate('Valid openITCOCKPIT Enterprise license.');
                    if (result.isCommunityLicense) {
                        msg = this.TranslocoService.translate('Valid openITCOCKPIT Community license.');
                    }

                    this.valid = true;
                    this.license_type = result.isCommunityLicense ? 'community' : 'enterprise';
                    this.notyService.genericSuccess(msg);
                    this.loadLicense();
                })
        );
    }

}
