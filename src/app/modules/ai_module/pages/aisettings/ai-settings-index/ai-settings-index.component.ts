import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective
} from '@coreui/angular';

import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { GenericValidationError } from '../../../../../generic-responses';
import { AiSettingsService } from '../ai-settings.service';
import { AiSettings } from '../ai-settings.interface';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { PermissionDirective } from '../../../../../permissions/permission.directive';

@Component({
    selector: 'oitc-ai-settings-index',
    imports: [
        FormsModule,
        RouterLink,
        TranslocoDirective,
        PermissionDirective,
        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        CardFooterComponent,
        FormDirective,
        FormLabelDirective,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        XsButtonDirective,
        TableLoaderComponent,
        SelectComponent
    ],
    templateUrl: './ai-settings-index.component.html',
    styleUrl: './ai-settings-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiSettingsIndexComponent implements OnInit, OnDestroy {

    public settings?: AiSettings;
    public providers: SelectKeyValue[] = [];
    public errors: GenericValidationError | null = null;

    private readonly AiSettingsService = inject(AiSettingsService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly subscriptions: Subscription = new Subscription();

    public ngOnInit(): void {
        this.subscriptions.add(this.AiSettingsService.get().subscribe(result => {
            this.settings = result.AiSetting;
            // And back again, so the select lands on its first entry rather
            // than on nothing at all.
            this.settings.ai_llm_provider_id_utility = this.settings.ai_llm_provider_id_utility ?? 0;
            this.cdr.markForCheck();
        }));

        this.subscriptions.add(this.AiSettingsService.loadProviders().subscribe(providers => {
            // Empty first, so "the agent's own model" is what an installation
            // that never thought about this ends up with.
            this.providers = [
                {key: 0, value: this.TranslocoService.translate('Use the model of the agent')},
                ...providers
            ];
            this.cdr.markForCheck();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public submit(): void {
        if (!this.settings) {
            return;
        }

        // The select says "nothing chosen" with 0, the column says it with
        // NULL. Translating here keeps that detail out of the template.
        const payload: AiSettings = {
            ...this.settings,
            ai_llm_provider_id_utility: this.settings.ai_llm_provider_id_utility || null
        };

        this.subscriptions.add(this.AiSettingsService.save(payload).subscribe(result => {
            this.cdr.markForCheck();

            if (result.success) {
                this.notyService.genericSuccess(
                    this.TranslocoService.translate('saved successfully'),
                    this.TranslocoService.translate('AI Globals')
                );
                return;
            }

            this.errors = result.data as GenericValidationError;
            this.notyService.genericError();
        }));
    }
}
