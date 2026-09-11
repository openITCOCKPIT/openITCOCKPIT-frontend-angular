import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
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
    InputGroupComponent
} from '@coreui/angular';

import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { GenericValidationError } from '../../../../../generic-responses';
import { AiSelectOption } from '../../aiagents/ai-agents.interface';
import { AiLlmProvidersService } from '../ai-llm-providers.service';
import { AiLlmProviderPost, getDefaultAiLlmProviderPost } from '../ai-llm-providers.interface';
import { PermissionDirective } from '../../../../../permissions/permission.directive';

@Component({
    selector: 'oitc-ai-llm-providers-add',
    imports: [
        FormsModule,
        RouterLink,
        TranslocoDirective,
        PermissionDirective,
        FaIconComponent,
        BackButtonDirective,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        CardFooterComponent,
        FormDirective,
        FormLabelDirective,
        FormControlDirective,
        InputGroupComponent,
        FormCheckInputDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        RequiredIconComponent,
        SelectComponent,
        XsButtonDirective
    ],
    templateUrl: './ai-llm-providers-add.component.html',
    styleUrl: './ai-llm-providers-add.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiLlmProvidersAddComponent implements OnInit, OnDestroy {

    public post: AiLlmProviderPost = getDefaultAiLlmProviderPost();
    public errors: GenericValidationError | null = null;

    /** What the endpoint says it serves; empty until asked. */
    public models: AiSelectOption[] = [];
    public selectedModel: string | null = null;
    public isLoadingModels: boolean = false;
    public containers: SelectKeyValue[] = [];
    public hasStoredKey: boolean = false;

    private readonly AiLlmProvidersService = inject(AiLlmProvidersService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly subscriptions: Subscription = new Subscription();

    protected providerId: number = 0;

    public ngOnInit(): void {

        this.subscriptions.add(this.AiLlmProvidersService.loadContainers().subscribe(containers => {
            this.containers = containers;
            this.cdr.markForCheck();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public submit(): void {
        const request = this.AiLlmProvidersService.add(this.post);

        this.subscriptions.add(request.subscribe(result => {
            this.cdr.markForCheck();

            if (result.success) {
                this.notyService.genericSuccess(
                    this.TranslocoService.translate('created successfully'),
                    this.TranslocoService.translate('AI provider')
                );
                this.router.navigate(['/ai_module/llmproviders/index']);
                return;
            }

            this.errors = result.data as GenericValidationError;
            this.notyService.genericError();
        }));
    }

    /**
     * Asks the endpoint what it serves, so a model can be picked instead of
     * typed. A wrong name otherwise only shows up at the first question.
     *
     * @return void
     */
    public loadModels(): void {
        this.isLoadingModels = true;
        this.cdr.markForCheck();

        this.subscriptions.add(this.AiLlmProvidersService.loadModels(this.post, 0).subscribe(result => {
            this.isLoadingModels = false;

            if (result?.success) {
                this.models = result.models.map(model => ({key: model, value: model}));
                this.notyService.genericSuccess(result.message);
            } else {
                // Not a failure worth stopping for: /models is optional in the
                // protocol, so an endpoint that refuses it is still usable and
                // the name just has to be typed.
                this.models = [];
                this.notyService.genericError(result?.message);
            }

            this.cdr.markForCheck();
        }));
    }

    /**
     * @param model
     * @return void
     */
    public pickModel(model: string): void {
        this.post.model = model;
        this.cdr.markForCheck();
    }

}
