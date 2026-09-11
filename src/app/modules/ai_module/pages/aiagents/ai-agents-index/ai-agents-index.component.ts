import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { AiAgentsService } from '../ai-agents.service';
import { AiAgent, getDefaultAiAgentsIndexParams } from '../ai-agents.interface';
import { PermissionDirective } from '../../../../../permissions/permission.directive';

@Component({
    selector: 'oitc-ai-agents-index',
    imports: [
        RouterLink,
        TranslocoDirective,
        PermissionDirective,
        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        TableDirective,
        XsButtonDirective,
        NoRecordsComponent,
        TableLoaderComponent
    ],
    templateUrl: './ai-agents-index.component.html',
    styleUrl: './ai-agents-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiAgentsIndexComponent implements OnInit, OnDestroy {

    public agents: AiAgent[] = [];
    public isLoading: boolean = true;

    private readonly AiAgentsService = inject(AiAgentsService);
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
        this.subscriptions.add(this.AiAgentsService.getIndex(getDefaultAiAgentsIndexParams()).subscribe(result => {
            this.agents = result.all_agents;
            this.isLoading = false;
            this.cdr.markForCheck();
        }));
    }

    public delete(agent: AiAgent): void {
        this.subscriptions.add(this.AiAgentsService.delete(agent.id).subscribe({
            next: () => {
                this.notyService.genericSuccess();
                this.load();
            },
            error: () => this.notyService.genericError()
        }));
    }

    public trackById(index: number, agent: AiAgent): number {
        return agent.id;
    }
}
