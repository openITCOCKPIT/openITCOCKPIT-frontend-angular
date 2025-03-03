import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import {
    CardBodyComponent, CardComponent, CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective,
    FormControlDirective,
    FormDirective, FormLabelDirective
} from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SlackPost} from '../slack-settings.interface';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { Subscription } from 'rxjs';
import { ApikeyDocModalComponent } from '../../../../../layouts/coreui/apikey-doc-modal/apikey-doc-modal.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
//import { NgIf } from '@angular/common';
import { SlackSettingsService} from '../slack-settings.service';
import { NotyService } from '../../../../../layouts/coreui/noty.service';

@Component({
  selector: 'oitc-slack-settings-index',
    imports: [
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        FormDirective,
        FormsModule,
        ReactiveFormsModule,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        RequiredIconComponent,
        CardComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        TrueFalseDirective,
        ApikeyDocModalComponent,
        CardFooterComponent,
        XsButtonDirective,
        FormLoaderComponent,
      //  NgIf
    ],
  templateUrl: './slack-settings-index.component.html',
  styleUrl: './slack-settings-index.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlackSettingsIndexComponent implements OnInit, OnDestroy {

    private readonly subscriptions: Subscription = new Subscription();
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly SlackSettingsService: SlackSettingsService = inject(SlackSettingsService);
    private readonly notyService: NotyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);
    public init: boolean = false;
    public errors: GenericValidationError | null = null;
    protected currentCommandAsPostRequest: string = '';
    public post:SlackPost = {
        SlackSettings: {
            api_url: '',
            oauth_access_token: '',
            two_way: false,
            use_proxy: false,
        }
    };

    public ngOnInit(): void {
        this.subscriptions.add(this.SlackSettingsService.getSlackSettings().subscribe(data => {
            this.post.SlackSettings = data;
            this.init = true;
            this.cdr.markForCheck();
        }));

        const API_KEY_TRANSLATION = this.TranslocoService.translate('YOUR_API_KEY_HERE');
        this.currentCommandAsPostRequest = `https://${window.location.hostname}/slack_module/acknowledge/submit.json?apikey=${API_KEY_TRANSLATION}`;
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }



    public submitSlackSettings() {
        if (!this.post) {
            return;
        }

        this.subscriptions.add(
            this.SlackSettingsService.setSlackSettings(this.post).subscribe((result: GenericResponseWrapper): void => {
                    this.cdr.markForCheck();
                    if (result.success) {
                        this.errors = null;
                        this.post.SlackSettings = result.data;
                        this.notyService.genericSuccess();
                        return;
                    }

                    this.errors = result.data as GenericValidationError;
                    this.notyService.genericError();
                }
            )
        );
    }


}
