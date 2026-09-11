import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormCheckInputDirective,
    TableDirective
} from '@coreui/angular';

import { BackButtonDirective } from '../../../../../directives/back-button.directive';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { AiMcpServersService } from '../ai-mcp-servers.service';
import { AiMcpTool, AiMcpToolsServer } from '../../aiagents/ai-agents.interface';
import { PermissionDirective } from '../../../../../permissions/permission.directive';

/**
 * The tool catalogue of one MCP instance.
 *
 * Its own page rather than a row that expands, because this is editing rather
 * than looking: every tool carries two switches, and what they decide is what
 * an agent pointed at this instance is able to do at all. A tool that is not
 * offered cannot be called.
 */
@Component({
    selector: 'oitc-ai-mcp-servers-tools',
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
        FormCheckInputDirective,
        TableDirective,
        XsButtonDirective,
        BackButtonDirective,
        TableLoaderComponent
    ],
    templateUrl: './ai-mcp-servers-tools.component.html',
    styleUrl: './ai-mcp-servers-tools.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiMcpServersToolsComponent implements OnInit, OnDestroy {

    public server?: AiMcpToolsServer;
    public tools: AiMcpTool[] = [];
    public syncedAt: string | null = null;
    public isLoading: boolean = true;
    public isSyncing: boolean = false;

    private serverId: number = 0;

    private readonly AiMcpServersService = inject(AiMcpServersService);
    private readonly notyService = inject(NotyService);
    private readonly route = inject(ActivatedRoute);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly subscriptions: Subscription = new Subscription();

    public ngOnInit(): void {
        this.serverId = Number(this.route.snapshot.paramMap.get('id') || 0);
        this.load();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    /**
     * Reads the catalogue from the instance again.
     *
     * Until this has run once there is nothing on this page: the module only
     * knows what an instance offers because it asked.
     */
    public sync(): void {
        this.isSyncing = true;
        this.cdr.markForCheck();

        this.subscriptions.add(this.AiMcpServersService.sync(this.serverId).subscribe(result => {
            this.isSyncing = false;

            if (result.success) {
                this.notyService.genericSuccess(result.message, this.server?.name);
                this.load();
                return;
            }

            this.notyService.genericError(result.message);
            this.cdr.markForCheck();
        }));
    }

    public setEnabled(tool: AiMcpTool, enabled: boolean): void {
        this.subscriptions.add(this.AiMcpServersService.toggleTool(tool.id, {is_enabled: enabled}).subscribe({
            next: () => {
                tool.is_enabled = enabled;
                this.cdr.markForCheck();
            },
            error: () => this.notyService.genericError()
        }));
    }

    public setConfirmation(tool: AiMcpTool, required: boolean): void {
        this.subscriptions.add(this.AiMcpServersService.toggleTool(tool.id, {requires_confirmation: required}).subscribe({
            next: () => {
                tool.requires_confirmation = required;
                this.cdr.markForCheck();
            },
            error: () => this.notyService.genericError()
        }));
    }

    public get enabledCount(): number {
        return this.tools.filter(tool => tool.is_enabled).length;
    }

    public get writingCount(): number {
        return this.tools.filter(tool => !tool.read_only).length;
    }

    public trackById(index: number, tool: AiMcpTool): number {
        return tool.id;
    }

    /**
     * @return void
     */
    private load(): void {
        this.isLoading = true;
        this.cdr.markForCheck();

        this.subscriptions.add(this.AiMcpServersService.getTools(this.serverId).subscribe({
            next: (result) => {
                this.server = result.server;
                this.tools = result.tools;
                this.syncedAt = result.tools_synced_at;
                this.isLoading = false;
                this.cdr.markForCheck();
            },
            error: () => {
                this.isLoading = false;
                this.notyService.genericError();
                this.cdr.markForCheck();
            }
        }));
    }
}
