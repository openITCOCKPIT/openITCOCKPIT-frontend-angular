import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    AgentconnectorAutoTlsConnectionTest,
    AgentconnectorCreateServiceRoot,
    AgentModes,
    AgentServicesForCreate
} from '../agentconnector.interface';
import { AgentconnectorWizardStepsEnum, AgentHttpClientErrors } from '../agentconnector.enums';
import {
    AgentconnectorWizardProgressbarComponent
} from '../agentconnector-wizard-progressbar/agentconnector-wizard-progressbar.component';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
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

@Component({
    selector: 'oitc-agentconnector-create-services',
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
        ProgressBarModule
    ],
    templateUrl: './agentconnector-create-services.component.html',
    styleUrl: './agentconnector-create-services.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentconnectorCreateServicesComponent implements OnInit, OnDestroy {

    // Wizard step 5

    public isLoading: boolean = true;
    public isSaving: boolean = false;
    public showSuccessful: boolean = false;

    public hostId: number = 0;
    public disableNextButton: boolean = true;
    public config!: AgentConfig;
    public host?: HostEntity;
    public connection_test?: null | AgentconnectorAutoTlsConnectionTest;
    public agentModeForProgress = AgentModes.Pull;
    public servicesAvailable: boolean = false;

    private servicesForCreate?: AgentServicesForCreate;

    protected readonly AgentModes = AgentModes;
    protected readonly AgentconnectorWizardStepsEnum = AgentconnectorWizardStepsEnum;

    private subscriptions: Subscription = new Subscription();
    private readonly AgentconnectorService = inject(AgentconnectorService);
    private readonly notyService = inject(NotyService);
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private readonly TranslocoService = inject(TranslocoService);
    private cdr = inject(ChangeDetectorRef);
    private testConnection: boolean = false;

    public ngOnInit(): void {
        this.subscriptions.add(this.route.queryParams.subscribe(params => {
            // Here, params is an object containing the current query parameters.
            // You can do something with these parameters here.
            //console.log(params);
            const hostId = Number(this.route.snapshot.paramMap.get('hostId'));
            if (hostId > 0) {
                this.hostId = hostId;
            }

            // Query String Parameters
            const testConnection = String(params['testConnection']) || false;
            if (testConnection === 'true') {
                this.testConnection = true;
            }

            this.loadServices();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadServices() {
        this.isLoading = true;
        this.subscriptions.add(this.AgentconnectorService.loadCreateServices(this.hostId, this.testConnection).subscribe(
            (response: AgentconnectorCreateServiceRoot) => {
                this.cdr.markForCheck();
                this.isLoading = false;

                this.config = response.config;
                this.host = response.host;
                this.connection_test = response.connection_test
                this.servicesForCreate = response.services;

                if (this.config.bool.enable_push_mode) {
                    // Update the Wizard progress bar to show the "Select Agent" step
                    this.agentModeForProgress = AgentModes.Push;
                }

                this.servicesAvailable = Object.keys(response.services).length > 0;

            }
        ));
    }

    public onBackButtonClick() {
        if (this.config.bool.enable_push_mode) {
            // In Push Mode, the user need to select the agent manually
            this.router.navigate(['/agentconnector/select_agent', this.hostId]);
            return;
        }

        // Pull mode
        this.router.navigate(['/agentconnector/autotls', this.hostId]);
    }

    public onNextButtonClick() {

    }

    protected readonly AgentHttpClientErrors = AgentHttpClientErrors;
}
