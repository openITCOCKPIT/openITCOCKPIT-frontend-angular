import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    TableDirective
} from '@coreui/angular';

import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { GenericValidationError } from '../../../../../generic-responses';
import { AiLlmProvidersService } from '../ai-llm-providers.service';
import { AiLlmProvider } from '../ai-llm-providers.interface';
import { PermissionDirective } from '../../../../../permissions/permission.directive';

@Component({
    selector: 'oitc-ai-llm-providers-index',
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
        XsButtonDirective,
        NoRecordsComponent,
        TableLoaderComponent,
        TableDirective
    ],
    templateUrl: './ai-llm-providers-index.component.html',
    styleUrl: './ai-llm-providers-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiLlmProvidersIndexComponent implements OnInit, OnDestroy {

    public providers: AiLlmProvider[] = [];
    public isLoading: boolean = true;

    /**
     * Outcome of the last test per provider, as a state rather than a message.
     *
     * The message goes to a toast, so a result of varying length does not
     * change the width of the row.
     */
    public testState: { [id: number]: 'ok' | 'failed' | 'running' } = {};

    private readonly AiLlmProvidersService = inject(AiLlmProvidersService);
    private readonly notyService = inject(NotyService);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly subscriptions: Subscription = new Subscription();

    public ngOnInit(): void {
        this.load();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.isLoading = true;
        this.subscriptions.add(this.AiLlmProvidersService.getIndex({angular: true}).subscribe(result => {
            this.providers = result.all_providers;
            this.isLoading = false;
            this.cdr.markForCheck();
        }));
    }

    /** One trivial completion, so a wrong key or model shows up here. */
    public test(provider: AiLlmProvider): void {
        this.testState[provider.id] = 'running';
        this.cdr.markForCheck();

        this.subscriptions.add(this.AiLlmProvidersService.test(provider.id).subscribe(result => {
            this.testState[provider.id] = result.success ? 'ok' : 'failed';

            if (result.success) {
                this.notyService.genericSuccess(result.message, provider.name);
            } else {
                this.notyService.genericError(result.message);
            }

            this.cdr.markForCheck();
        }));
    }

    public delete(provider: AiLlmProvider): void {
        this.subscriptions.add(this.AiLlmProvidersService.delete(provider.id).subscribe({
            next: () => {
                this.notyService.genericSuccess();
                this.load();
            },
            error: () => this.notyService.genericError()
        }));
    }

    public trackById(index: number, provider: AiLlmProvider): number {
        return provider.id;
    }
}
