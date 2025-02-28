import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';
import { FormLoaderComponent } from '../../../../../layouts/primeng/loading/form-loader/form-loader.component';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent, CardTitleDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormLabelDirective,
    RowComponent
} from '@coreui/angular';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { FormsModule } from '@angular/forms';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { Subscription } from 'rxjs';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { ScmsettingsService } from '../scmsettings.service';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import { HistoryService } from '../../../../../history.service';
import { ScmSettingsIndex, ScmSettingsPost } from '../scmsettings.interface';

@Component({
    selector: 'oitc-scm-settings-index',
    imports: [
        TranslocoDirective,
        RouterLink,
        FaIconComponent,
        NgIf,
        FormLoaderComponent,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        RequiredIconComponent,
        FormsModule,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormControlDirective,
        FormCheckComponent,
        TrueFalseDirective,
        FormCheckInputDirective,
        DebounceDirective,
        FormCheckLabelDirective,
        CardFooterComponent,
        XsButtonDirective,
        RowComponent,
        ColComponent,
        CardTitleDirective
    ],
    templateUrl: './scm-settings-index.component.html',
    styleUrl: './scm-settings-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScmSettingsIndexComponent implements OnInit, OnDestroy {
    private readonly ScmsettingsService: ScmsettingsService = inject(ScmsettingsService);
    private readonly TrasnlocoService = inject(TranslocoService);
    public PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);

    private subscriptions: Subscription = new Subscription();

    public readonly route = inject(ActivatedRoute);
    public errors: GenericValidationError | null = null;
    public post!: ScmSettingsPost;

    private cdr = inject(ChangeDetectorRef);

    public ngOnInit() {
        this.load();
    }

    private load(): void {
        this.subscriptions.add(this.ScmsettingsService.loadScmSettings()
            .subscribe((result: ScmSettingsIndex) => {
                this.post = result.scm_settings;
                this.cdr.markForCheck();
            }))
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public updateScmSettings(): void {
        this.subscriptions.add(this.ScmsettingsService.submit(this.post)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TrasnlocoService.translate('Data');
                    const msg = this.TrasnlocoService.translate('saved successfully');

                    this.notyService.genericSuccess(msg, title);
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
