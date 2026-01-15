import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import { ScansService } from '../scans.service';
import { HistoryService } from '../../../../../history.service';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormLabelDirective,
    FormSelectDirective,
    NavComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { ObjectUuidComponent } from '../../../../../layouts/coreui/object-uuid/object-uuid.component';
import {
    CheckmkDiscoveryResult,
    getDefaultScansIndexPost,
    ScansCheckmkItem,
    ScansCreateCheckmkServicesPost,
    ScansHost,
    ScansProcessListDiscoveryResult
} from '../scans.interface';
import { SelectKeyValue, SelectKeyValueString } from '../../../../../layouts/primeng/select.interface';
import { PermissionDirective } from '../../../../../permissions/permission.directive';

import { PaginatorModule } from 'primeng/paginator';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { CheckmkAddressFamily } from '../../../checkmk.enums';

import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { GenericIdResponse, GenericValidationError } from '../../../../../generic-responses';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ProgressBarModule } from 'primeng/progressbar';
import { AgentHttpClientErrors } from '../../../../../pages/agentconnector/agentconnector.enums';
import { ServicetemplateTypesEnum } from '../../../../../pages/servicetemplates/servicetemplate-types.enum';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'oitc-scans-index',
    imports: [
        RouterLink,
        FaIconComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavComponent,
        ObjectUuidComponent,
        CardBodyComponent,
        TranslocoDirective,
        PermissionDirective,
        ColComponent,
        RowComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        PaginatorModule,
        FormLabelDirective,
        RequiredIconComponent,
        SelectComponent,
        CardFooterComponent,
        FormSelectDirective,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        XsButtonDirective,
        ProgressBarModule,
        TableDirective,
        MultiSelectComponent,
        FormsModule
    ],
    templateUrl: './scans-index.component.html',
    styleUrl: './scans-index.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScansIndexComponent implements OnInit, OnDestroy {

    // Variables required for the Checkmk discovery and to display the result
    public hostId: number = 0;
    public host?: ScansHost;
    public mkAgents: SelectKeyValue[] = [];
    public post = getDefaultScansIndexPost();
    public errors: GenericValidationError | null = null; // looks like this is not used?

    public executingDiscovery: boolean = false;
    public isSatellite: boolean = false;

    public discoveryResult?: CheckmkDiscoveryResult;
    public MkProcesses ?: ScansProcessListDiscoveryResult;

    private satTaskIdHealth: number = 0;
    private satStatusHealthUpdateInterval: any = null;
    private satTaskIdProcess: number = 0;
    private satStatusProcessUpdateInterval: any = null;

    public satelliteHealthError: string = '';
    public satelliteProcessError: string = '';

    public missingTemplates: ScansCheckmkItem[] = [];
    public healthSelect: SelectKeyValueString[] = [];
    public healthSelectedHashes: string[] = [];
    public processSelect: SelectKeyValueString[] = [];
    public processSelectedHashes: string[] = [];
    public servicesSelect: SelectKeyValueString[] = [];
    public servicesSelectedHashes: string[] = [];
    public systemdSelect: SelectKeyValueString[] = [];
    public systemdSelectedHashes: string[] = [];

    // Variables required to create new services from Checkmk result
    public overwriteServicetemplateArguments: boolean = true;

    private subscriptions: Subscription = new Subscription();
    private readonly ScansService = inject(ScansService);
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private readonly router: Router = inject(Router);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const id = Number(this.route.snapshot.paramMap.get('id'));
            this.hostId = id;
            this.loadScansIndex();
        });
    }

    public ngOnDestroy(): void {
        if (this.satStatusHealthUpdateInterval) {
            clearInterval(this.satStatusHealthUpdateInterval);
        }
        if (this.satStatusProcessUpdateInterval) {
            clearInterval(this.satStatusProcessUpdateInterval);
        }

        this.subscriptions.unsubscribe();
    }

    public loadScansIndex() {
        this.subscriptions.add(this.ScansService.getScansConfiguration(this.hostId).subscribe(data => {
            this.cdr.markForCheck();

            this.host = data.host;
            this.mkAgents = data.allMkAgents;

            // Overwrite default config with server data
            this.post.last_used_mkagents.agent_id = data.selectedAgent;
            this.post.addressFamily = data.addressFamily;
            this.post.Mksnmp = data.snmp_config;
        }));
    }

    public executeDiscovery() {
        this.notyService.scrollContentDivToTop();
        this.executingDiscovery = true;

        this.discoveryResult = undefined;
        this.MkProcesses = undefined;

        this.isSatellite = false;
        this.satelliteHealthError = '';
        this.satelliteProcessError = '';

        this.cdr.markForCheck();

        this.subscriptions.add(this.ScansService.runAjaxHealthList(this.hostId, this.post).subscribe(healthResponse => {
            this.cdr.markForCheck();

            if (healthResponse.satTaskId) {
                this.isSatellite = true;
                // Discovery is running on satellite, and we need to wait for the satellite to finish

                this.satTaskIdHealth = healthResponse.satTaskId;
                this.satStatusHealthUpdateInterval = setInterval(() => {
                    this.checkSatelliteHealthStatus();
                }, 5000);

            } else {
                this.discoveryResult = healthResponse.discoveryResult;
                if (this.discoveryResult?.missing_template) {
                    this.missingTemplates = Object.values(this.discoveryResult.missing_template);
                }

                if (this.discoveryResult?.result) {
                    // The server response with a hashmap, where the key is a md5 hash.
                    // To create the service, we just need to send the md5 hash to the server.
                    // We create a select box with all md5 hashes and the service name.
                    this.healthSelectedHashes = [];
                    for (const md5hash in this.discoveryResult?.result) {
                        const item = this.discoveryResult?.result[md5hash];
                        this.healthSelect.push({
                            key: md5hash,
                            value: item?.description
                        });
                    }
                }

            }

            // Process monitoring is only with the Checkmk Agent possible
            this.subscriptions.add(this.ScansService.runAjaxProcessList(this.hostId).subscribe(processResponse => {
                this.cdr.markForCheck();

                if (processResponse.satTaskId) {
                    this.isSatellite = true;
                    // Discovery is running on satellite, and we need to wait for the satellite to finish

                    this.satTaskIdProcess = processResponse.satTaskId;
                    this.satStatusProcessUpdateInterval = setInterval(() => {
                        this.checkSatelliteProcessStatus();
                    }, 5000);
                } else {
                    this.MkProcesses = processResponse.MkProcesses;
                    // The server response with a hashmap, where the key is a md5 hash.
                    // To create the service, we just need to send the md5 hash to the server.
                    // We create a select box with all md5 hashes and the service name.
                    this.processSelectedHashes = [];
                    this.servicesSelectedHashes = [];
                    this.servicesSelectedHashes = [];
                    if (processResponse.MkProcesses) {
                        Object.keys(processResponse.MkProcesses).forEach((key: string) => {
                            // Terrible language design
                            const typescriptKey = key as keyof ScansProcessListDiscoveryResult

                            if (processResponse.MkProcesses && processResponse.MkProcesses[typescriptKey]) {
                                for (const md5hash in processResponse.MkProcesses[typescriptKey]) {
                                    const item = processResponse.MkProcesses[typescriptKey][md5hash];

                                    switch (typescriptKey) {
                                        case 'ps':
                                            this.processSelect.push({
                                                key: md5hash,
                                                value: item?.description
                                            });
                                            break;

                                        case 'services':
                                            this.servicesSelect.push({
                                                key: md5hash,
                                                value: item?.description
                                            });
                                            break;

                                        case 'systemd_units.services':
                                            this.systemdSelect.push({
                                                key: md5hash,
                                                value: item?.description
                                            });
                                            break;

                                    }

                                }
                            }
                        });
                    }

                    this.executingDiscovery = false;

                    if (this.satStatusHealthUpdateInterval) {
                        clearInterval(this.satStatusHealthUpdateInterval);
                    }
                    if (this.satStatusProcessUpdateInterval) {
                        clearInterval(this.satStatusProcessUpdateInterval);
                    }
                }
            }));

        }));
    }

    // Called by click
    public cancelSatRequest() {
        if (this.satStatusHealthUpdateInterval) {
            clearInterval(this.satStatusHealthUpdateInterval);
        }
        if (this.satStatusProcessUpdateInterval) {
            clearInterval(this.satStatusProcessUpdateInterval);
        }

        this.satTaskIdHealth = 0;
        this.satStatusHealthUpdateInterval = null;
        this.satTaskIdProcess = 0;
        this.satStatusProcessUpdateInterval = null;
        this.satelliteHealthError = '';
        this.satelliteProcessError = '';

        this.executingDiscovery = false;

        this.notyService.genericInfo('Waiting for satellite result got cancelled');
    }

    private checkSatelliteHealthStatus() {
        this.subscriptions.add(this.ScansService.getSatelliteHealthDiscoveryStatus(this.satTaskIdHealth).subscribe(result => {
            if (result.pending) {
                // No result yet - keep waiting
                return;
            }

            this.cdr.markForCheck();

            if (this.errors) {
                this.satelliteHealthError = String(result.error);
            }

            if (result.discoveryResult) {
                this.discoveryResult = result.discoveryResult;
                if (this.discoveryResult?.missing_template) {
                    this.missingTemplates = Object.values(this.discoveryResult.missing_template);
                }

                if (this.discoveryResult?.result) {
                    // The server response with a hashmap, where the key is a md5 hash.
                    // To create the service, we just need to send the md5 hash to the server.
                    // We create a select box with all md5 hashes and the service name.
                    this.healthSelectedHashes = [];
                    for (const md5hash in this.discoveryResult?.result) {
                        const item = this.discoveryResult?.result[md5hash];
                        this.healthSelect.push({
                            key: md5hash,
                            value: item?.description
                        });
                    }
                }
            }

            if (this.satStatusHealthUpdateInterval) {
                clearInterval(this.satStatusHealthUpdateInterval);
                this.satStatusHealthUpdateInterval = null;
            }

            if (this.MkProcesses) {
                this.executingDiscovery = false;
            }

            this.satTaskIdHealth = 0;
        }));
    }

    private checkSatelliteProcessStatus() {
        this.subscriptions.add(this.ScansService.getSatelliteProcessDiscoveryStatus(this.satTaskIdProcess).subscribe(result => {
            if (result.pending) {
                // No result yet - keep waiting
                return;
            }

            this.cdr.markForCheck();

            if (this.errors) {
                this.satelliteProcessError = String(result.error);
            }

            if (result.MkProcesses) {
                this.MkProcesses = result.MkProcesses;

                // The server response with a hashmap, where the key is a md5 hash.
                // To create the service, we just need to send the md5 hash to the server.
                // We create a select box with all md5 hashes and the service name.
                this.processSelectedHashes = [];
                this.servicesSelectedHashes = [];
                this.servicesSelectedHashes = [];
                Object.keys(result.MkProcesses).forEach((key: string) => {
                    // Terrible language design
                    const typescriptKey = key as keyof ScansProcessListDiscoveryResult

                    if (result.MkProcesses && result.MkProcesses[typescriptKey]) {
                        for (const md5hash in result.MkProcesses[typescriptKey]) {
                            const item = result.MkProcesses[typescriptKey][md5hash];

                            switch (typescriptKey) {
                                case 'ps':
                                    this.processSelect.push({
                                        key: md5hash,
                                        value: item?.description
                                    });
                                    break;

                                case 'services':
                                    this.servicesSelect.push({
                                        key: md5hash,
                                        value: item?.description
                                    });
                                    break;

                                case 'systemd_units.services':
                                    this.systemdSelect.push({
                                        key: md5hash,
                                        value: item?.description
                                    });
                                    break;

                            }

                        }
                    }

                });


            }

            if (this.satStatusProcessUpdateInterval) {
                clearInterval(this.satStatusProcessUpdateInterval);
                this.satStatusProcessUpdateInterval = null;
            }

            if (this.discoveryResult) {
                this.executingDiscovery = false;
            }

            this.satTaskIdProcess = 0;
        }));
    }

    public submit() {

        const data: ScansCreateCheckmkServicesPost = {
            Scan: {
                health: this.healthSelectedHashes,
                ps: this.processSelectedHashes,
                services: this.servicesSelectedHashes,
                systemd_units_services: this.systemdSelectedHashes // dot (.) in post name is a bad idea
            },
            overwriteServicetemplateArguments: this.overwriteServicetemplateArguments
        };

        this.subscriptions.add(this.ScansService.saveCheckmkServices(this.hostId, data)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    const title = this.TranslocoService.translate('Services');
                    const msg = this.TranslocoService.translate('created successfully');
                    const url = ['services', 'serviceList', this.hostId];

                    this.notyService.genericSuccess(msg, title, url);

                    this.HistoryService.navigateWithFallback(['/services/serviceList', this.hostId]);
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
            }))
    }

    protected readonly CheckmkAddressFamily = CheckmkAddressFamily;
    protected readonly AgentHttpClientErrors = AgentHttpClientErrors;
    protected readonly ServicetemplateTypesEnum = ServicetemplateTypesEnum;
}
