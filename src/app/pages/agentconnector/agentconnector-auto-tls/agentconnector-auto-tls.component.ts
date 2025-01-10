import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    AgentconnectorSatelliteTaskStatus,
    AgentconnectorWizardStepsEnum,
    AgentHttpClientErrors
} from '../agentconnector.enums';
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
import {
    AgentconnectorAutoTlsConnectionTest,
    AgentconnectorAutoTlsSatelliteTaskResponse,
    AgentModes
} from '../agentconnector.interface';
import { ProgressBarModule } from 'primeng/progressbar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'oitc-agentconnector-auto-tls',
    imports: [
    AgentconnectorWizardProgressbarComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FaIconComponent,
    NgIf,
    PermissionDirective,
    TranslocoDirective,
    RouterLink,
    ColComponent,
    RowComponent,
    ProgressBarModule
],
    templateUrl: './agentconnector-auto-tls.component.html',
    styleUrl: './agentconnector-auto-tls.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentconnectorAutoTlsComponent implements OnInit, OnDestroy {

    // Wizard step 4 (Pull Mode only)

    public hostId: number = 0;
    public disableNextButton: boolean = true;
    public config!: AgentConfig;
    public host?: HostEntity;
    public connection_test?: AgentconnectorAutoTlsConnectionTest;

    public isSatellite: boolean = false;
    public satellite_task_id: null | number = null;
    public runningCheck: boolean = true;
    public hasSatelliteError: boolean = false;
    public satelliteErrorMsg: string = '';

    private satelliteInterval: any = null;

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

            this.loadAutoTls();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadAutoTls(reExchangeAutoTLS: boolean = false) {
        this.runningCheck = true;
        this.cdr.markForCheck();

        this.subscriptions.add(this.AgentconnectorService.loadAutoTls(this.hostId, reExchangeAutoTLS).subscribe((data) => {
            this.cdr.markForCheck();

            if (data.satellite_task_id) {
                // Request is running on a Satellite - Wait for response data...
                this.isSatellite = true;
                this.satellite_task_id = data.satellite_task_id;
                this.startSatelliteCheckInterval();
            } else {
                // Request was handled by the Master System
                this.runningCheck = false;
                this.config = data.config;
                this.host = data.host;
                this.connection_test = data.connection_test;
                this.disableNextButton = data.connection_test.status !== 'success';
            }
        }));
    }

    public reExchangeAutoTLS() {
        this.loadAutoTls(true);
    }

    public cancelSatRequest() {
        if (this.satelliteInterval) {
            clearInterval(this.satelliteInterval);
            this.satelliteInterval = null;
        }
        this.runningCheck = false;
    }

    private startSatelliteCheckInterval() {
        if (this.satelliteInterval) {
            clearInterval(this.satelliteInterval);
            this.satelliteInterval = null;
        }

        this.satelliteInterval = setInterval(() => {
            this.checkForSatelliteResponse();
        }, 5000);
    }

    private checkForSatelliteResponse() {
        if (this.satellite_task_id) {

            const sub = this.AgentconnectorService.loadSatelliteResponse(this.satellite_task_id).subscribe({
                next: (response: AgentconnectorAutoTlsSatelliteTaskResponse) => {
                    // 200 ok
                    this.cdr.markForCheck();

                    if (typeof response.task.status === "undefined") {
                        this.cancelSatRequest();
                        const msg = this.TranslocoService.translate('Unexpected answer from Server');
                        this.notyService.genericError(msg);
                        return;
                    }

                    if (response.task.status === AgentconnectorSatelliteTaskStatus.SatelliteTaskFinishedSuccessfully || response.task.status === AgentconnectorSatelliteTaskStatus.SatelliteTaskFinishedError) {
                        // We got a result from the Satellite Server
                        this.cancelSatRequest();

                        if (response.task.status === AgentconnectorSatelliteTaskStatus.SatelliteTaskFinishedError) {
                            try {
                                this.connection_test = JSON.parse(String(response.task.result)) as AgentconnectorAutoTlsConnectionTest;
                            } catch (e) {
                                // Error is no json
                                this.hasSatelliteError = true;
                                this.satelliteErrorMsg = String(response.task.result);
                            }

                            this.runningCheck = false;
                            return;
                        }

                        if (response.task.status === AgentconnectorSatelliteTaskStatus.SatelliteTaskFinishedSuccessfully) {
                            this.runningCheck = false;


                            const responseJson = JSON.parse(String(response.task.result));
                            this.connection_test = responseJson as AgentconnectorAutoTlsConnectionTest;

                            this.disableNextButton = this.connection_test.status !== 'success';
                        }
                    }

                    if (response.task.status === AgentconnectorSatelliteTaskStatus.SatelliteTaskFinishedError) {
                        this.runningCheck = false;
                    }

                },
                error: (error: HttpErrorResponse) => {
                    this.cdr.markForCheck();
                    this.cancelSatRequest();

                    if (error.status === 404) {
                        const msg = this.TranslocoService.translate('Task not found in database!');
                        this.notyService.genericError(msg);
                    }
                }
            });

            this.subscriptions.add(sub);
        }
    }

    public onBackButtonClick() {
        this.router.navigate(['/agentconnector/install', this.hostId]);
    }

    public onNextButtonClick() {
        this.router.navigate(['/agentconnector/create_services', this.hostId], {queryParams: {testConnection: false}});
    }

    protected readonly AgentHttpClientErrors = AgentHttpClientErrors;
}
