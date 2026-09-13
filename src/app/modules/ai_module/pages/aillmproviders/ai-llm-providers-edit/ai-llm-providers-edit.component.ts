import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
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
import {
    AiLlmProviderPost,
    AiLlmProviderRequestPreview,
    getDefaultAiLlmProviderPost
} from '../ai-llm-providers.interface';
import { PermissionDirective } from '../../../../../permissions/permission.directive';

@Component({
    selector: 'oitc-ai-llm-providers-edit',
    imports: [
        FormsModule,
        NgClass,
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
    templateUrl: './ai-llm-providers-edit.component.html',
    styleUrl: './ai-llm-providers-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiLlmProvidersEditComponent implements OnInit, OnDestroy {

    public post: AiLlmProviderPost = getDefaultAiLlmProviderPost();
    public errors: GenericValidationError | null = null;

    /** What the endpoint says it serves; empty until asked. */
    public models: AiSelectOption[] = [];
    public isLoadingModels: boolean = false;
    public isTesting: boolean = false;
    public testOk: boolean = false;
    public testMessage: string = '';
    /** The request the test made, shown on demand. */
    public testRequest: AiLlmProviderRequestPreview | null = null;
    public containers: SelectKeyValue[] = [];
    public hasStoredKey: boolean = false;
    /** A key is stored but no longer decryptable. */
    public keyUnreadable: boolean = false;

    private readonly AiLlmProvidersService = inject(AiLlmProvidersService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly subscriptions: Subscription = new Subscription();

    protected providerId: number = 0;

    public ngOnInit(): void {
        this.providerId = Number(this.route.snapshot.paramMap.get('id'));

        this.subscriptions.add(this.AiLlmProvidersService.getEdit(this.providerId).subscribe(provider => {
            this.hasStoredKey = provider.has_api_key;
            this.keyUnreadable = provider.api_key_unreadable;
            this.post = {
                container_id: provider.container_id,
                name: provider.name,
                base_url: provider.base_url,
                // Left empty: an empty value means "keep the stored
                // key", which is how this form works without the key ever
                // being sent to the browser.
                api_key: '',
                auth_header: provider.auth_header,
                auth_prefix: provider.auth_prefix,
                model: provider.model,
                temperature: provider.temperature,
                max_tokens: provider.max_tokens,
                timeout_seconds: provider.timeout_seconds,
                ignore_ssl_certificate: provider.ignore_ssl_certificate,
                extra_headers: provider.extra_headers ?? '',
                extra_body: provider.extra_body ?? '',
                is_enabled: provider.is_enabled
            };
            this.cdr.markForCheck();
        }));

        this.subscriptions.add(this.AiLlmProvidersService.loadContainers().subscribe(containers => {
            this.containers = containers;
            this.cdr.markForCheck();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public submit(): void {
        const request = this.AiLlmProvidersService.edit(this.post, this.providerId);

        this.subscriptions.add(request.subscribe(result => {
            this.cdr.markForCheck();

            if (result.success) {
                this.notyService.genericSuccess(
                    this.TranslocoService.translate('updated successfully'),
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
    /**
     * Asks the endpoint one question with what is on the form.
     *
     * @return void
     */
    /**
     * The header names of the shown request, in a stable order.
     *
     * @return string[]
     */
    public headerNames(): string[] {
        return this.testRequest ? Object.keys(this.testRequest.headers) : [];
    }

    /**
     * Renders the request the values on the form would produce.
     *
     * Separate from the test: this sends nothing and is therefore instant,
     * which is what makes it usable while typing.
     *
     * @return void
     */
    /**
     * Turns the list back into a plain field.
     *
     * /models is optional in the protocol and never guaranteed to be
     * complete, so the typed name has to stay reachable. The current value is
     * kept: switching the control must not discard what was chosen.
     *
     * @return void
     */
    public typeModel(): void {
        this.models = [];
    }

    public showRequest(): void {
        // A toggle: pressing it again puts the form back the way it was.
        if (this.testRequest !== null) {
            this.testRequest = null;

            return;
        }

        this.subscriptions.add(this.AiLlmProvidersService.preview(this.post, this.providerId).subscribe(result => {
            this.testRequest = result?.request ?? null;
            this.cdr.markForCheck();
        }));
    }

    public testModel(): void {
        this.isTesting = true;
        this.testMessage = '';
        this.testRequest = null;
        this.cdr.markForCheck();

        this.subscriptions.add(this.AiLlmProvidersService.testForm(this.post, this.providerId).subscribe(result => {
            this.isTesting = false;
            this.testOk = result?.success === true;
            this.testMessage = result?.message || '';
            this.testRequest = result?.request ?? null;
            this.cdr.markForCheck();
        }));
    }

    public loadModels(): void {
        this.isLoadingModels = true;
        this.cdr.markForCheck();

        this.subscriptions.add(this.AiLlmProvidersService.loadModels(this.post, this.providerId).subscribe(result => {
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


}
