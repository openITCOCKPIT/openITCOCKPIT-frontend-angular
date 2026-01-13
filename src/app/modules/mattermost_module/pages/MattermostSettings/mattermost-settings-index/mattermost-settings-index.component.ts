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
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { Subscription } from 'rxjs';
import { ApikeyDocModalComponent } from '../../../../../layouts/coreui/apikey-doc-modal/apikey-doc-modal.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';

import { MattermostSettings} from '../../../mattermost.interface';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { MattermostService} from '../../../mattermost.service';


@Component({
  selector: 'oitc-mattermost-settings-index',
    imports: [
    TranslocoDirective,
    FaIconComponent,
    PermissionDirective,
    RouterLink,
    FormDirective,
    FormsModule,
    FormLoaderComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    CardBodyComponent,
    FormControlDirective,
    FormErrorDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    RequiredIconComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    TrueFalseDirective,
    ApikeyDocModalComponent,
    CardFooterComponent,
    XsButtonDirective
],
  templateUrl: './mattermost-settings-index.component.html',
  styleUrl: './mattermost-settings-index.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MattermostSettingsIndexComponent implements OnInit, OnDestroy {

    private readonly notyService: NotyService = inject(NotyService);
    private readonly MattermostService: MattermostService = inject(MattermostService);
    private cdr = inject(ChangeDetectorRef);
    private readonly subscriptions: Subscription = new Subscription();
    public post!:MattermostSettings;
    public errors: GenericValidationError | null = null;

    public ngOnInit(): void {
        this.subscriptions.add(this.MattermostService.getMattermostSettings().subscribe(data => {
            this.post = data;
            this.cdr.markForCheck();
        }));
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public submitMattermostSettings() {
        if (!this.post) {
            return;
        }

        this.subscriptions.add(
            this.MattermostService.setSMattermostSettings(this.post).subscribe((result: GenericResponseWrapper): void => {
                    this.cdr.markForCheck();
                    if (result.success) {
                        this.errors = null;
                        this.post = result.data;
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
