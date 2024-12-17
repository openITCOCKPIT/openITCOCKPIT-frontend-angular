import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    AlertComponent,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ContainerComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormLabelDirective,
    LocalStorageService
} from '@coreui/angular';
import { HostsService } from '../../hosts/hosts.service';
import { WizardsService } from '../wizards.service';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { HostAddEditSuccessResponse, HostDnsLookup, HostPost } from '../../hosts/hosts.interface';
import { GenericValidationError } from '../../../generic-responses';
import { LabelLinkComponent } from '../../../layouts/coreui/label-link/label-link.component';
import { PermissionsService } from '../../../permissions/permissions.service';
import { AnimateCssService } from '../../../services/animate-css.service';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { WizardElement, WizardsIndex } from '../wizards.interface';

@Component({
    selector: 'oitc-wizards-wizard-host-configuration',
    standalone: true,
    imports: [
        FaIconComponent,
        TranslocoDirective,
        RouterLink,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        ContainerComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormsModule,
        FormCheckLabelDirective,
        RequiredIconComponent,
        SelectComponent,
        FormErrorDirective,
        FormFeedbackComponent,
        NgIf,
        AlertComponent,
        FormControlDirective,
        FormLabelDirective,
        TranslocoPipe,
        AsyncPipe,
        LabelLinkComponent,
        ButtonDirective
    ],
    templateUrl: './wizards-wizard-host-configuration.component.html',
    styleUrl: './wizards-wizard-host-configuration.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WizardsWizardHostConfigurationComponent implements OnInit, OnDestroy {
    private readonly route = inject(ActivatedRoute);
    private readonly HostsService: HostsService = inject(HostsService);
    private readonly WizardsService: WizardsService = inject(WizardsService);
    private readonly Subscriptions: Subscription = new Subscription();
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly LocalStorageService = inject(LocalStorageService);
    private readonly AnimateCssService = inject(AnimateCssService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    private readonly router = inject(Router);

    protected readonly PermissionsService: PermissionsService = inject(PermissionsService);
    protected WizardElement: WizardElement = {} as WizardElement;
    protected hosttemplates: SelectKeyValue[] = [];
    protected hostgroups: SelectKeyValue[] = [];
    protected satellites: SelectKeyValue[] = [];
    protected hostId: number = 0;
    protected parenthosts: SelectKeyValue[] = [];
    protected hostPost: HostPost = {} as HostPost;
    protected errors: GenericValidationError | null = null;
    protected useExistingHost: boolean = false;
    // state: wizard.state, selectedOs: wizard.selected_os, typeId: wizard.type_id, title: wizard.title
    protected state: string = '';
    protected selectedOs: string = '';
    protected typeId: string = '';
    protected title: string = '';
    protected p5: string = '';
    protected containers: SelectKeyValue[] = [];
    protected hosts: SelectKeyValue[] = [];

    public data = {
        createAnother: false,
        dnsLookUp: false,
        dnsHostnameNotFound: false,
        dnsAddressNotFound: false,

        isHostnameInUse: false
    };

    public submit() {
        if (this.useExistingHost) {
            let sgmts: string[] = this.state.split(/(?=[A-Z])/).map(segment => segment.toLowerCase());
            let url: string = this.WizardElement.second_url.replaceAll(':hostId', this.hostId.toString());
            console.warn(sgmts);
            console.warn(url);
            this.router.navigate([url]);
            return;
        }
        this.Subscriptions.add(this.HostsService.add(this.hostPost, false)
            .subscribe((result) => {
                this.cdr.markForCheck();
                if (result.success) {

                    const response = result.data as HostAddEditSuccessResponse;

                    const title = this.TranslocoService.translate('Host');
                    const genericMsg = this.TranslocoService.translate('created successfully');
                    const url = ['hosts', 'edit', response.id];

                    let msg = genericMsg + ' ';

                    this.notyService.genericSuccess(msg, title, url);

                    this.ngOnInit();
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

    public onSatelliteChange() {
        this.loadParentHosts('');
    }

    public loadParentHosts = (searchString: string) => {
        if (!this.hostPost.container_id) {
            return;
        }

        this.Subscriptions.add(this.HostsService.loadParentHosts(searchString, this.hostPost.container_id, this.hostPost.parenthosts._ids, this.hostPost.satellite_id)
            .subscribe((result) => {
                this.parenthosts = result;
                this.cdr.markForCheck();
            })
        );
    };

    protected onContainerChange(): void {
        console.warn('containerIdChanged');

        this.Subscriptions.add(this.HostsService.loadElements(this.hostPost.container_id)
            .subscribe((result) => {
                this.hosttemplates = result.hosttemplates;
                this.hostgroups = result.hostgroups;
                this.satellites = result.satellites;
                this.cdr.markForCheck();
            })
        );
    }

    public onDnsLookupChange() {
        const value = this.data.dnsLookUp ? 'true' : 'false';
        this.LocalStorageService.setItem('HostsDnsLookUpEnabled', value);

        if (!this.data.dnsLookUp) {
            this.data.dnsHostnameNotFound = false;
            this.data.dnsAddressNotFound = false;
        }
    }

    public checkForDuplicateHostname() {
        this.Subscriptions.add(this.HostsService.checkForDuplicateHostname(this.hostPost.name)
            .subscribe((result) => {
                this.data.isHostnameInUse = result;
            })
        );
    }

    public runDnsLookup(lookupByHostname: boolean) {
        if (!this.data.dnsLookUp) {
            return;
        }

        let data: HostDnsLookup = {
            hostname: null,
            address: null
        };


        if (lookupByHostname) {
            if (this.hostPost.name == '') {
                return;
            }
            data.hostname = this.hostPost.name;
        } else {
            if (this.hostPost.address == '') {
                return;
            }
            data.address = this.hostPost.address;
        }

        this.Subscriptions.add(this.HostsService.runDnsLookup(data)
            .subscribe((result) => {
                if (lookupByHostname) {
                    const address = result.address;
                    if (address === null) {
                        this.data.dnsHostnameNotFound = true;
                    } else {
                        this.data.dnsHostnameNotFound = false;
                        this.hostPost.address = address;
                        this.AnimateCssService.animateCSS('#HostAddress', 'headShake');
                    }
                } else {
                    const hostname = result.hostname;
                    if (hostname === null) {
                        this.data.dnsAddressNotFound = true;
                    } else {
                        this.data.dnsAddressNotFound = false;
                        this.hostPost.name = hostname;
                        this.checkForDuplicateHostname();
                        this.AnimateCssService.animateCSS('#HostName', 'headShake');
                    }
                }
                this.cdr.markForCheck();
            })
        );
    }

    public ngOnInit() {
        // /:typeId/:title/:hostId/:state/:selectedOs
        this.typeId = String(this.route.snapshot.paramMap.get('typeId'));
        this.title = String(this.route.snapshot.paramMap.get('title'));
        this.hostId = Number(this.route.snapshot.paramMap.get('hostId'));
        this.state = String(this.route.snapshot.paramMap.get('state'));
        this.selectedOs = String(this.route.snapshot.paramMap.get('selectedOs'));

        console.warn('typeId', this.typeId);
        console.warn('title', this.title);
        console.warn('hostId', this.hostId);
        console.warn('state', this.state);
        console.warn('selectedOs', this.selectedOs);

        this.loadWizardElement();
        this.loadContainers();
        this.loadHosts();
    }

    protected loadWizardElement(): void {
        // Fetch containers on load.
        this.Subscriptions.add(this.WizardsService.getIndex().subscribe((wizards: WizardsIndex) => {
            this.WizardElement = wizards.wizards[this.typeId];
            this.cdr.markForCheck();
        }));
    }

    protected loadContainers(): void {
        // Fetch containers on load.
        this.Subscriptions.add(this.HostsService.loadContainers().subscribe((containers: SelectKeyValue[]) => {
            this.containers = containers;
            this.cdr.markForCheck();
        }));
    }

    public ngOnDestroy() {
        this.Subscriptions.unsubscribe();
    }

    // ARROW FUNCTIONS
    protected loadHosts = (search: string = '') => {
        // Fetch containers on load.
        this.Subscriptions.add(this.WizardsService.loadHostsByString(search).subscribe((hosts: SelectKeyValue[]) => {
            this.hosts = hosts;
            this.cdr.markForCheck();
        }));
    }
}
