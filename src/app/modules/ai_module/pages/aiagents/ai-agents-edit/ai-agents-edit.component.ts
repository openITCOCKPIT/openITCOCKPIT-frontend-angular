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
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';

import { AiAgentsService } from '../ai-agents.service';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import {
    AiAgentPost,
    AiMcpServerOption,
    AiMcpTool,
    AiSelectOption,
    getDefaultAiAgentPost
} from '../ai-agents.interface';

/**
 * The agent mask, editing an existing one.
 *
 * Same form as the add page. Kept as its own component rather than a mode flag
 * because that is how every other module here does it, and a shared component
 * with an isEdit branch reads worse than two that each do one thing.
 *
 * The module exists for many small agents with one job each rather than one
 * assistant that does everything, so this is the screen that carries the idea.
 *
 * The third block is filled from the selected MCP instance rather than from a
 * list kept here: which tools exist and which system prompts are offered are
 * things only that instance knows. Its toolsets file is replaceable and
 * customers are meant to invent their own sets, so anything hardcoded here
 * would be wrong the day somebody does.
 */
@Component({
    selector: 'oitc-ai-agents-edit',
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
        FormCheckInputDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        RequiredIconComponent,
        SelectComponent,
        XsButtonDirective
    ],
    templateUrl: './ai-agents-edit.component.html',
    styleUrl: './ai-agents-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiAgentsEditComponent implements OnInit, OnDestroy {

    public post: AiAgentPost = getDefaultAiAgentPost();
    public errors: GenericValidationError | null = null;

    public containers: SelectKeyValue[] = [];
    public providers: SelectKeyValue[] = [];
    public mcpServers: AiMcpServerOption[] = [];

    /** The instance currently selected, so the form can explain what it is. */
    public selectedMcpServer?: AiMcpServerOption;
    public tools: AiMcpTool[] = [];
    public toolsSyncedAt: string | null = null;
    public isLoadingTools: boolean = false;

    /**
     * Option lists for oitc-select. Labels are translated here rather than in
     * the template, because the component renders optionLabel as given.
     */
    public promptModes: AiSelectOption[] = [];

    public languages: AiSelectOption[] = [
        {key: 'en', value: 'English'},
        {key: 'de', value: 'Deutsch'}
    ];

    /**
     * The MCP instances, flattened for the dropdown. The toolsets travel in
     * the label so the choice reads as what it is - picking a role, not a host.
     */
    public mcpServerOptions: { id: number, label: string }[] = [];

    private readonly AiAgentsService = inject(AiAgentsService);
    private readonly notyService = inject(NotyService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    private agentId: number = 0;
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly subscriptions: Subscription = new Subscription();

    public ngOnInit(): void {
        this.promptModes = [
            {key: 'mcp', value: this.TranslocoService.translate('Use the prompts the MCP server provides')},
            {key: 'mcp_plus_custom', value: this.TranslocoService.translate('MCP prompts plus my own additions')},
            {key: 'custom', value: this.TranslocoService.translate('Only my own prompt')}
        ];

        this.agentId = Number(this.route.snapshot.paramMap.get('id'));

        this.subscriptions.add(this.AiAgentsService.getEdit(this.agentId).subscribe(agent => {
            this.post = {
                container_id: agent.container_id,
                name: agent.name,
                description: agent.description ?? '',
                icon: agent.icon,
                ai_llm_provider_id: agent.ai_llm_provider_id,
                ai_mcp_server_id: agent.ai_mcp_server_id,
                system_prompt_mode: agent.system_prompt_mode,
                system_prompt_language: agent.system_prompt_language,
                system_prompt_custom: agent.system_prompt_custom ?? '',
                max_steps: agent.max_steps,
                max_history_messages: agent.max_history_messages,
                tool_result_max_chars: agent.tool_result_max_chars,
                allow_write_tools: agent.allow_write_tools,
                confirmation_ttl_minutes: agent.confirmation_ttl_minutes,
                is_enabled: agent.is_enabled
            };
            // Show what this instance can do straight away, not only after the
            // dropdown is touched.
            this.onMcpServerChange();
            this.cdr.markForCheck();
        }));

        this.subscriptions.add(this.AiAgentsService.loadContainers().subscribe(containers => {
            this.containers = containers;
            this.cdr.markForCheck();
        }));

        this.subscriptions.add(this.AiAgentsService.loadProviders().subscribe(providers => {
            this.providers = providers;
            this.cdr.markForCheck();
        }));

        this.subscriptions.add(this.AiAgentsService.loadMcpServers().subscribe(result => {
            this.mcpServers = result.mcp_servers;
            this.mcpServerOptions = result.mcp_servers.map(server => ({
                id: server.id,
                label: `${server.name} (${server.toolsets})`
            }));
            this.cdr.markForCheck();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * Asks the chosen instance what it can do.
     */
    public onMcpServerChange(): void {
        this.selectedMcpServer = this.mcpServers.find(server => server.id === this.post.ai_mcp_server_id);
        this.tools = [];
        this.toolsSyncedAt = null;

        if (!this.post.ai_mcp_server_id) {
            this.cdr.markForCheck();
            return;
        }

        // An instance that has write tools registered still starts read-only
        // here. Enabling writes is a separate, deliberate act.
        if (this.selectedMcpServer && !this.selectedMcpServer.write_tools_enabled) {
            this.post.allow_write_tools = false;
        }

        this.isLoadingTools = true;
        this.subscriptions.add(this.AiAgentsService.loadTools(this.post.ai_mcp_server_id).subscribe({
            next: (result) => {
                this.tools = result.tools;
                this.toolsSyncedAt = result.tools_synced_at;
                this.isLoadingTools = false;
                this.cdr.markForCheck();
            },
            error: () => {
                this.isLoadingTools = false;
                this.notyService.genericError(
                    this.TranslocoService.translate('Could not read the tool catalogue. Run "Sync" on the MCP server first.')
                );
                this.cdr.markForCheck();
            }
        }));
    }

    public get writeToolCount(): number {
        return this.tools.filter(tool => !tool.read_only).length;
    }

    public get enabledToolCount(): number {
        return this.tools.filter(tool => tool.is_enabled).length;
    }

    public submit(): void {
        this.subscriptions.add(this.AiAgentsService.edit(this.post, this.agentId).subscribe(result => {
            this.cdr.markForCheck();

            if (result.success) {
                const response = result.data as GenericIdResponse;
                const title = this.TranslocoService.translate('AI agent');
                const message = this.TranslocoService.translate('updated successfully');

                this.notyService.genericSuccess(message, title);
                this.router.navigate(['/ai_module/agents/index']);
                return;
            }

            this.errors = result.data as GenericValidationError;
            this.notyService.genericError();
        }));
    }
}
