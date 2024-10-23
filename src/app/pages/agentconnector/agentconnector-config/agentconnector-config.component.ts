import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AgentconnectorAgentConfigSatellite, AgentModes } from '../agentconnector.interface';
import {
    AgentconnectorConnectionTypes,
    AgentconnectorOperatingSystems,
    AgentconnectorWebserverTypes,
    AgentconnectorWizardStepsEnum
} from '../agentconnector.enums';
import {
    AgentconnectorWizardProgressbarComponent
} from '../agentconnector-wizard-progressbar/agentconnector-wizard-progressbar.component';
import {
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTextDirective,
    CardTitleDirective,
    ColComponent,
    DropdownItemDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormLabelDirective,
    FormSelectDirective,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AgentconnectorService } from '../agentconnector.service';
import { AgentConfig } from '../agentconfig.interface';
import { BlockLoaderComponent } from '../../../layouts/primeng/loading/block-loader/block-loader.component';
import { JsonPipe, NgClass, NgIf } from '@angular/common';
import { HostEntity } from '../../hosts/hosts.interface';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { PaginatorModule } from 'primeng/paginator';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { GenericIdResponse, GenericValidationError } from '../../../generic-responses';
import { TemplateDiffBtnComponent } from '../../../components/template-diff-btn/template-diff-btn.component';
import { TrueFalseDirective } from '../../../directives/true-false.directive';
import { ApikeyDocModalComponent } from '../../../layouts/coreui/apikey-doc-modal/apikey-doc-modal.component';
import { NotyService } from '../../../layouts/coreui/noty.service';

@Component({
    selector: 'oitc-agentconnector-config',
    standalone: true,
    imports: [
        AgentconnectorWizardProgressbarComponent,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        FaIconComponent,
        PermissionDirective,
        TranslocoDirective,
        RouterLink,
        BlockLoaderComponent,
        NgIf,
        CardFooterComponent,
        CardTextDirective,
        XsButtonDirective,
        NgClass,
        FormSelectDirective,
        PaginatorModule,
        RequiredIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        TranslocoPipe,
        TemplateDiffBtnComponent,
        TrueFalseDirective,
        DropdownItemDirective,
        ApikeyDocModalComponent,
        JsonPipe,
        RowComponent,
        ColComponent
    ],
    templateUrl: './agentconnector-config.component.html',
    styleUrl: './agentconnector-config.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgentconnectorConfigComponent implements OnInit, OnDestroy {

    // Wizard step 2

    public hostId: number = 0;
    public pushAgentId: number = 0;
    public connectionType: AgentconnectorConnectionTypes = AgentconnectorConnectionTypes.AutoTls;
    public webserverType: AgentconnectorWebserverTypes = AgentconnectorWebserverTypes.Https;
    public preselectedOs: AgentconnectorOperatingSystems = AgentconnectorOperatingSystems.Linux;
    public urlMode?: AgentModes;

    public config!: AgentConfig;
    public host?: HostEntity;
    public satellite?: AgentconnectorAgentConfigSatellite;
    public isNewConfig: boolean = false;
    public errors: GenericValidationError | null = null;
    public hostname = window.location.hostname;

    private subscriptions: Subscription = new Subscription();
    private readonly AgentconnectorService = inject(AgentconnectorService);
    private readonly notyService = inject(NotyService);
    public readonly route = inject(ActivatedRoute);
    public readonly router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    protected readonly AgentModes = AgentModes;
    protected readonly AgentconnectorWizardStepsEnum = AgentconnectorWizardStepsEnum;

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
            const pushAgentId = Number(params['pushAgentId']) || 0;
            if (pushAgentId > 0) {
                this.pushAgentId = pushAgentId;
            }

            const mode = params['mode'] || undefined;
            if (mode == AgentModes.Push || mode == AgentModes.Pull) {
                this.urlMode = mode;
            }

            const selectedOs = params['selectedOs'] || undefined;
            if (selectedOs) {
                this.preselectedOs = selectedOs as AgentconnectorOperatingSystems;
            }

            // Load current agent config if any exists
            this.loadAgentConfig();
        }));
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadAgentConfig() {
        this.subscriptions.add(this.AgentconnectorService.loadAgentConfig(this.hostId).subscribe(data => {
            this.host = data.host;
            this.config = data.config;
            this.satellite = undefined;
            if (data.satellite) {
                // object (null for hosts on the master system)
                this.satellite = data.satellite;
            }
            this.isNewConfig = data.isNewConfig;

            if (this.config.bool.use_autossl === false && this.config.bool.use_https === true) {
                this.connectionType = AgentconnectorConnectionTypes.Https;
            }
            if (this.config.bool.use_autossl === false && this.config.bool.use_https === false) {
                this.connectionType = AgentconnectorConnectionTypes.Http;
            }

            this.webserverType = AgentconnectorWebserverTypes.Https;
            if (this.config.bool.push_webserver_use_https === false) {
                this.webserverType = AgentconnectorWebserverTypes.Http;
            }


            if (this.urlMode) {
                // The current Agnular route has a "mode"
                // User came from the first wizard page

                this.config.bool.enable_push_mode = this.urlMode == AgentModes.Push;
            }

            if (this.isNewConfig) {
                this.config.string.operating_system = this.preselectedOs;
            }

            if (this.config.bool.enable_push_mode === true && this.config.string.push_oitc_server_url === '' && this.satellite) {
                //Set Satellite Address as default push target address
                this.config.string.push_oitc_server_url = 'https://' + this.satellite.address;
            }

            this.cdr.markForCheck();
        }));
    }

    public changeOs(os: AgentconnectorOperatingSystems) {
        this.config.string.operating_system = os;
    }

    private cleanupConnectionTypes() {
        // This function cleanup if the user clicked around and enabled auto-tls and than switched to http plaintext etc

        if (this.config.bool.enable_push_mode === false) {
            // Agent in PULL Mode
            this.config.bool.push_enable_webserver = false;

            if (this.connectionType === AgentconnectorConnectionTypes.Http) {
                // Plaintext connection
                this.config.bool.use_autossl = false;
                this.config.bool.use_https = false;
                this.config.bool.use_https_verify = false;
                this.config.string.ssl_certfile = '';
                this.config.string.ssl_keyfile = '';
            }

            if (this.connectionType === AgentconnectorConnectionTypes.Https) {
                // HTTPS connection
                this.config.bool.use_https = true;
                this.config.bool.use_autossl = false;
            }

            if (this.connectionType === AgentconnectorConnectionTypes.AutoTls) {
                // Auto-TLS connection
                this.config.bool.use_autossl = true;
                this.config.bool.use_https = false;
                this.config.bool.use_https_verify = false;
                this.config.string.ssl_certfile = '';
                this.config.string.ssl_keyfile = '';
            }
        } else {
            // Agent in PUSH Mode
            this.config.bool.use_autossl = false; // no autotls in push mode
            this.config.bool.use_https = false; // the agent push the data to oitc this variable is for pull mode
            this.config.bool.use_https_verify = false; // the agent push the data to oitc this variable is for pull mode
        }
    }

    private submitAgentConfig() {
        this.cleanupConnectionTypes();

        let pushAgentId: number | null = null;
        if (this.pushAgentId > 0) {
            pushAgentId = this.pushAgentId;
        }

        this.subscriptions.add(this.AgentconnectorService.saveAgentConfig(this.config, this.hostId, pushAgentId)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {
                    const response = result.data as GenericIdResponse;
                    this.notyService.genericSuccess();

                    this.notyService.scrollContentDivToTop();
                    this.errors = null;

                    if (response.id) {
                        this.router.navigate(['/agentconnector/install', this.hostId]);
                    }

                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                }
            }));
    }

    public onBackButtonClick() {
        this.router.navigate(['/agentconnector/wizard'], {queryParams: {hostId: this.hostId}});
    }

    public onNextButtonClick() {
        this.submitAgentConfig();
    }

    protected readonly AgentconnectorOperatingSystems = AgentconnectorOperatingSystems;
    protected readonly Number = Number;
    protected readonly AgentconnectorConnectionTypes = AgentconnectorConnectionTypes;
    protected readonly AgentconnectorWebserverTypes = AgentconnectorWebserverTypes;
}
