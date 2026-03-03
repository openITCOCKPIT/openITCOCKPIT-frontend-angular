import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AgentconnectorWizardInstallRoot, AgentModes } from '../agentconnector.interface';
import { AgentconnectorOperatingSystems, AgentconnectorWizardStepsEnum } from '../agentconnector.enums';
import {
    AgentconnectorWizardProgressbarComponent
} from '../agentconnector-wizard-progressbar/agentconnector-wizard-progressbar.component';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AgentConfig } from '../agentconfig.interface';
import { HostEntity } from '../../hosts/hosts.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { AgentconnectorService } from '../agentconnector.service';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'oitc-agentconnector-install',
    imports: [
        AgentconnectorWizardProgressbarComponent,
        BlockLoaderComponent,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        ColComponent,
        RowComponent,
        FormsModule
    ],
    templateUrl: './agentconnector-install.component.html',
    styleUrl: './agentconnector-install.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentconnectorInstallComponent implements OnInit, OnDestroy {

    // Wizard step 3

    public hostId: number = 0;
    public config!: AgentConfig;
    public host?: HostEntity;
    public configAsIni?: string;
    public agentModeForProgress = AgentModes.Pull;

    protected readonly AgentModes = AgentModes;
    protected readonly AgentconnectorWizardStepsEnum = AgentconnectorWizardStepsEnum;

    private subscriptions: Subscription = new Subscription();
    private readonly AgentconnectorService = inject(AgentconnectorService);
    private readonly notyService = inject(NotyService);
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
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

            this.load();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load() {
        this.subscriptions.add(this.AgentconnectorService.loadAgentConfigForInstall(this.hostId).subscribe(
            (response: AgentconnectorWizardInstallRoot) => {
                this.config = response.config;
                this.host = response.host;
                this.configAsIni = response.config_as_ini;

                if (this.config.bool.enable_push_mode) {
                    // Update the Wizard progress bar to show the "Select Agent" step
                    this.agentModeForProgress = AgentModes.Push;
                }

                this.cdr.markForCheck();
            }
        ));
    }

    public onBackButtonClick() {
        this.router.navigate(['/agentconnector/config', this.hostId]);
    }

    public onNextButtonClick() {
        if (this.config.bool.enable_push_mode) {
            // In Push Mode, the user need to select the agent manually
            this.router.navigate(['/agentconnector/select_agent', this.hostId]);
            return;
        }

        // Pull mode
        this.router.navigate(['/agentconnector/autotls', this.hostId]);
    }

    protected readonly AgentconnectorOperatingSystems = AgentconnectorOperatingSystems;
}
