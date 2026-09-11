import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslocoDirective } from '@jsverse/transloco';
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
import { AiMcpServersService } from '../ai-mcp-servers.service';
import { AiMcpServer } from '../ai-mcp-servers.interface';
import { PermissionDirective } from '../../../../../permissions/permission.directive';

/**
 * The MCP instances.
 *
 * One row per instance and nothing else: what an instance offers lives on its
 * own page, because deciding which tools an agent may call is editing rather
 * than looking, and it does not belong in a row that expands.
 *
 * Sync is what makes an instance usable at all - until the catalogue has been
 * read, the module does not know what the instance can do, and an agent
 * pointed at it would be offered no tools.
 */
@Component({
    selector: 'oitc-ai-mcp-servers-index',
    imports: [
        NgClass,
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
    templateUrl: './ai-mcp-servers-index.component.html',
    styleUrl: './ai-mcp-servers-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiMcpServersIndexComponent implements OnInit, OnDestroy {

    public servers: AiMcpServer[] = [];
    public isLoading: boolean = true;

    /**
     * Outcome of the last test or sync per instance, as a state rather than a
     * message. The message goes to a toast, because rendering it in the row
     * made the table reflow and shoved the other columns around.
     */
    public testState: { [id: number]: 'ok' | 'failed' | 'running' } = {};

    private readonly AiMcpServersService = inject(AiMcpServersService);
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
        this.subscriptions.add(this.AiMcpServersService.getIndex({angular: true}).subscribe(result => {
            this.servers = result.all_mcp_servers;
            this.isLoading = false;
            this.cdr.markForCheck();
        }));
    }

    public test(server: AiMcpServer): void {
        this.testState[server.id] = 'running';
        this.cdr.markForCheck();

        this.subscriptions.add(this.AiMcpServersService.test(server.id).subscribe(result => {
            this.testState[server.id] = result.success ? 'ok' : 'failed';

            if (result.success) {
                this.notyService.genericSuccess(result.message, server.name);
            } else {
                this.notyService.genericError(result.message);
            }

            this.cdr.markForCheck();
        }));
    }

    public sync(server: AiMcpServer): void {
        this.testState[server.id] = 'running';
        this.cdr.markForCheck();

        this.subscriptions.add(this.AiMcpServersService.sync(server.id).subscribe(result => {
            this.testState[server.id] = result.success ? 'ok' : 'failed';

            if (result.success) {
                this.notyService.genericSuccess(result.message, server.name);
                // The catalogue timestamp changed, so the row has to be reread.
                this.load();
            } else {
                this.notyService.genericError(result.message);
            }

            this.cdr.markForCheck();
        }));
    }

    public delete(server: AiMcpServer): void {
        this.subscriptions.add(this.AiMcpServersService.delete(server.id).subscribe({
            next: () => {
                this.notyService.genericSuccess();
                this.load();
            },
            error: () => this.notyService.genericError()
        }));
    }

    public trackById(index: number, server: AiMcpServer): number {
        return server.id;
    }
}
