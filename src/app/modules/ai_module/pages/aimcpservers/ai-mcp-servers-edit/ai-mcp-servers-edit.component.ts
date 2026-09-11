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
    FormLabelDirective
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
import { AiMcpServersService } from '../ai-mcp-servers.service';
import { AiMcpServerPost, getDefaultAiMcpServerPost } from '../ai-mcp-servers.interface';
import { PermissionDirective } from '../../../../../permissions/permission.directive';

@Component({
    selector: 'oitc-ai-mcp-servers-edit',
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
        FormCheckInputDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        RequiredIconComponent,
        SelectComponent,
        XsButtonDirective
    ],
    templateUrl: './ai-mcp-servers-edit.component.html',
    styleUrl: './ai-mcp-servers-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiMcpServersEditComponent implements OnInit, OnDestroy {

    public post: AiMcpServerPost = getDefaultAiMcpServerPost();
    public errors: GenericValidationError | null = null;
    public containers: SelectKeyValue[] = [];
    public hasStoredToken: boolean = false;

    private readonly AiMcpServersService = inject(AiMcpServersService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly subscriptions: Subscription = new Subscription();

    protected serverId: number = 0;

    public ngOnInit(): void {
        this.serverId = Number(this.route.snapshot.paramMap.get('id'));

        this.subscriptions.add(this.AiMcpServersService.getEdit(this.serverId).subscribe(server => {
            this.hasStoredToken = server.has_auth_token;
            this.post = {
                container_id: server.container_id,
                slug: server.slug,
                name: server.name,
                description: server.description ?? '',
                url: server.url,
                // Empty keeps the stored token, so it never has to be sent here.
                auth_token: '',
                toolsets: server.toolsets,
                write_tools_enabled: server.write_tools_enabled,
                service_account_label: server.service_account_label ?? '',
                ignore_ssl_certificate: server.ignore_ssl_certificate,
                timeout_seconds: server.timeout_seconds,
                is_enabled: server.is_enabled
            };
            this.cdr.markForCheck();
        }));

        this.subscriptions.add(this.AiMcpServersService.loadContainers().subscribe(containers => {
            this.containers = containers;
            this.cdr.markForCheck();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public submit(): void {
        const request = this.AiMcpServersService.edit(this.post, this.serverId);

        this.subscriptions.add(request.subscribe(result => {
            this.cdr.markForCheck();

            if (result.success) {
                this.notyService.genericSuccess(
                    this.TranslocoService.translate('updated successfully'),
                    this.TranslocoService.translate('MCP server')
                );
                this.router.navigate(['/ai_module/mcpservers/index']);
                return;
            }

            this.errors = result.data as GenericValidationError;
            this.notyService.genericError();
        }));
    }
}
