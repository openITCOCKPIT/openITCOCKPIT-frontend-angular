import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    AgentconnectorAutoTlsConnectionTest,
    AgentconnectorCreateServiceRoot,
    AgentModes,
    AgentServiceForCreate,
    AgentServicesForCreate,
    CreateAgentServicesPostResponse,
    CreateServiceCheckbox,
    CreateServiceMultiSelect,
    CreateServicesMultiSelect
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
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
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
import { DividerModule } from 'primeng/divider';
import { FormsModule } from '@angular/forms';




import { MultiSelectComponent } from '../../../layouts/primeng/multi-select/multi-select/multi-select.component';

import { UiBlockerComponent } from '../../../components/ui-blocker/ui-blocker.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'oitc-agentconnector-create-services',
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
    DividerModule,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormsModule,
    FormLabelDirective,
    MultiSelectComponent,
    UiBlockerComponent
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
    public hideConfig: boolean = false;

    public hostId: number = 0;
    public disableNextButton: boolean = true;
    public config!: AgentConfig;
    public host?: HostEntity;
    public connection_test?: null | AgentconnectorAutoTlsConnectionTest;
    public agentModeForProgress = AgentModes.Pull;
    public servicesAvailable: boolean = false;

    public newServicesAsCheckbox: CreateServiceCheckbox[] = [];
    public newServicesAsSelect: CreateServicesMultiSelect = {};

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
                this.disableNextButton = false;

                this.config = response.config;
                this.host = response.host;
                this.connection_test = response.connection_test

                if (this.config.bool.enable_push_mode) {
                    // Update the Wizard progress bar to show the "Select Agent" step
                    this.agentModeForProgress = AgentModes.Push;
                }

                this.servicesAvailable = Object.keys(response.services).length > 0;


                this.newServicesAsCheckbox = [];
                this.newServicesAsSelect = {};
                Object.keys(response.services).forEach(key => {
                    // Terrible language design
                    const typescriptKey = key as keyof AgentServicesForCreate

                    if (!Array.isArray(response.services[typescriptKey])) {
                        // Some services such as "CPU Load" or "SWAP" should be displayed as a Checkboxes
                        // In fact, we display all services as a checkbox that are not an array

                        this.newServicesAsCheckbox.push({
                            service_key: typescriptKey,
                            checkboxValue: true, // Mark all checkboxes as selected by default
                            service: response.services[typescriptKey]
                        });
                    } else {
                        // We have an array of services, such as "Disks" or "Processes"
                        // These services should be displayed as a multi select
                        // a category is "disk_io" or "disks_free" - basically the keys of AgentServicesForCreate
                        const category: CreateServiceMultiSelect = {
                            selectedIndicies: [], // The array index of selected services will go in here
                            options: [], // Key/Value pairs for the select options (key=array index)
                            services: [], // original services response from the server
                            length: response.services[typescriptKey].length // amount of services of this category
                        };

                        response.services[typescriptKey].forEach((service: AgentServiceForCreate, index) => {
                            category.options.push({
                                key: index,
                                value: service.name
                            });
                            category.services.push(service);
                        });

                        this.newServicesAsSelect[typescriptKey] = category;
                    }


                });


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
        this.disableNextButton = true;
        this.submitCreateNewServices();
    }

    private submitCreateNewServices() {
        this.isSaving = true;

        const post: AgentServiceForCreate[] = [];

        // Get the service object for each selected checkbox
        this.newServicesAsCheckbox.forEach((service: CreateServiceCheckbox) => {
            if (service.checkboxValue) {
                post.push(service.service);
            }
        });

        // Get the service object for each selected multi select
        Object.keys(this.newServicesAsSelect).forEach((key: string) => {
            // Terrible language design
            const typescriptKey = key as keyof AgentServicesForCreate

            const category = this.newServicesAsSelect[typescriptKey];
            if (category) {
                category.selectedIndicies.forEach((index: number) => {
                    post.push(category.services[index]);
                });
            }
        });

        if (post.length === 0) {
            this.notyService.genericInfo(this.TranslocoService.translate('Please select at least one service'));
            this.isSaving = false;
            this.disableNextButton = false;
            this.cdr.markForCheck();
            return;
        }

        const sub = this.AgentconnectorService.saveCreateServices(this.hostId, post).subscribe({
            next: (value: CreateAgentServicesPostResponse) => {
                this.cdr.markForCheck();

                //console.log(value); // Serve result with the new copied host templates
                // 200 ok
                this.notyService.genericSuccess();
                this.notyService.scrollContentDivToTop();

                this.showSuccessful = true;
                this.hideConfig = true;
                this.isSaving = false;

                return;
            },
            error: (error: HttpErrorResponse) => {
                this.cdr.markForCheck();

                this.notyService.genericError();

                this.showSuccessful = false;
                this.hideConfig = false;
                this.isSaving = false;
            }
        });

        this.subscriptions.add(sub);

    }

    protected readonly AgentHttpClientErrors = AgentHttpClientErrors;
}
