import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import {
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
    FormLabelDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TeamsSettings } from '../msteamssettings.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { MsteamssettingsService } from '../msteamssettings.service';
import { RouterLink } from '@angular/router';
import { GenericValidationError } from '../../../../../generic-responses';

@Component({
    selector: 'oitc-msteamssettings-index',
    imports: [
        BackButtonDirective,
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
        PermissionDirective,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink
    ],
    templateUrl: './msteamssettings-index.component.html',
    styleUrl: './msteamssettings-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MsteamssettingsIndexComponent implements OnInit, OnDestroy {


    private readonly subscriptions: Subscription = new Subscription();
    private readonly MsteamssettingsService: MsteamssettingsService = inject(MsteamssettingsService);
    private readonly notyService: NotyService = inject(NotyService);

    protected post: TeamsSettings = {} as TeamsSettings;
    protected errors: GenericValidationError | null = null;
    private cdr = inject(ChangeDetectorRef);

    protected submit(): void {
        this.subscriptions.add(
            this.MsteamssettingsService.saveMsteamsSettings(this.post).subscribe((response) => {
                this.cdr.markForCheck();
                if (response.success) {
                    this.errors = null;
                    this.notyService.genericSuccess();
                } else {
                    this.errors = response.data as GenericValidationError;
                    this.notyService.genericError();
                }
            })
        );
    }

    public ngOnInit(): void {
        this.subscriptions.add(
            this.MsteamssettingsService.getMsteamsSettings().subscribe((data: TeamsSettings) => {
                this.post = data;
                this.cdr.markForCheck();
            })
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}
