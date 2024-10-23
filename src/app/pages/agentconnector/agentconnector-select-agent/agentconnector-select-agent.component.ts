import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AgentconnectorSelectPushAgent, AgentModes } from '../agentconnector.interface';
import { AgentconnectorWizardStepsEnum } from '../agentconnector.enums';
import {
    AgentconnectorWizardProgressbarComponent
} from '../agentconnector-wizard-progressbar/agentconnector-wizard-progressbar.component';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormLabelDirective,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgIf } from '@angular/common';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { AgentConfig } from '../agentconfig.interface';
import { HostEntity } from '../../hosts/hosts.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AgentconnectorService } from '../agentconnector.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { GenericValidationError } from '../../../generic-responses';

@Component({
    selector: 'oitc-agentconnector-select-agent',
    standalone: true,
    imports: [
        AgentconnectorWizardProgressbarComponent,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        FaIconComponent,
        NgIf,
        PermissionDirective,
        RowComponent,
        TranslocoDirective,
        RouterLink,
        ProgressBarModule,
        FormLabelDirective,
        RequiredIconComponent,
        SelectComponent
    ],
    templateUrl: './agentconnector-select-agent.component.html',
    styleUrl: './agentconnector-select-agent.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentconnectorSelectAgentComponent implements OnInit, OnDestroy {

    // Wizard step 4 (Push Mode only)

    public hostId: number = 0;
    public disableNextButton: boolean = true;
    public config!: AgentConfig;
    public host?: HostEntity;
    public selectedPushAgentId: number = 0;

    public isLoading: boolean = true;

    public pushAgentsSelect: SelectKeyValue[] = [];
    private allPushAgents: AgentconnectorSelectPushAgent[] = [];

    protected readonly AgentModes = AgentModes;
    protected readonly AgentconnectorWizardStepsEnum = AgentconnectorWizardStepsEnum;

    private subscriptions: Subscription = new Subscription();
    private readonly AgentconnectorService = inject(AgentconnectorService);
    private readonly notyService = inject(NotyService);
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private readonly TranslocoService = inject(TranslocoService);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            const hostId = Number(this.route.snapshot.paramMap.get('hostId'));
            if (hostId > 0) {
                this.hostId = hostId;
            }

            this.loadAgents();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadAgents() {
        this.isLoading = true;
        this.cdr.markForCheck();

        this.subscriptions.add(this.AgentconnectorService.loadPushAgents(this.hostId).subscribe(response => {
            this.cdr.markForCheck();
            this.isLoading = false;
            this.config = response.config;
            this.host = response.host;
            this.selectedPushAgentId = response.selectedPushAgentId;

            this.allPushAgents = response.pushAgents;

            this.pushAgentsSelect = [];
            response.pushAgents.forEach(pushAgent => {
                this.pushAgentsSelect.push({
                    key: pushAgent.id,
                    value: pushAgent.name
                });
            });

            this.enableNextButton();

        }));
    }

    public enableNextButton() {
        this.disableNextButton = this.selectedPushAgentId <= 0;
        this.cdr.markForCheck();
    }

    public onBackButtonClick() {
        this.router.navigate(['/agentconnector/install', this.hostId]);
    }

    public onNextButtonClick() {

        // ITC-2879 & ITC-2932
        // Send back the agent_uuid to the server
        // so that openITCOCKPIT can update the record in the satellite_push_agents table (Import Module)
        let agentUuid = 'Unknown';
        for (var i in this.allPushAgents) {
            if (this.allPushAgents[i].id === this.selectedPushAgentId) {
                agentUuid = this.allPushAgents[i].agent_uuid;
            }
        }

        this.subscriptions.add(this.AgentconnectorService.savePushAgentAssignment(this.selectedPushAgentId, this.hostId, agentUuid)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {

                    this.router.navigate(['/agentconnector/create_services', this.hostId], {queryParams: {testConnection: false}});
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
            }));

    }

}
