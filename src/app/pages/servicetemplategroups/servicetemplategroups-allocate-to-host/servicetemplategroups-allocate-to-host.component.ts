import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import {
    AlertComponent,
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
    FormDirective,
    FormLabelDirective,
    NavComponent,
    NavItemComponent,
    ProgressBarComponent,
    RowComponent,
    TooltipDirective
} from '@coreui/angular';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormsModule } from '@angular/forms';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import {
    AllocateToHostGet,
    AllocateToHostGetServicetemplatesForDeploy,
    AllocateToHostPost,
    LoadHostsByStringResponse,
    LoadServicetemplategroupsByString,
    ServiceTemplateGroupsIndexParams
} from '../servicetemplategroups.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DeleteAllItem } from '../../../layouts/coreui/delete-all-modal/delete-all.interface';
import { ServicetemplategroupsService } from '../servicetemplategroups.service';
import { MatTooltip } from '@angular/material/tooltip';
import { GenericResponseWrapper, GenericValidationError } from '../../../generic-responses';
import { NotyService } from "../../../layouts/coreui/noty.service";
import { MultiSelectComponent } from "../../../layouts/primeng/multi-select/multi-select/multi-select.component";
import { SelectComponent } from "../../../layouts/primeng/select/select/select.component";
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';

@Component({
    selector: 'oitc-servicetemplategroups-allocate-to-host',
    standalone: true,
    imports: [
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CoreuiComponent,
        FaIconComponent,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormsModule,
        NavComponent,
        NavItemComponent,
        NgForOf,
        NgIf,
        NgSelectModule,
        PermissionDirective,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        AlertComponent,
        FaStackComponent,
        RowComponent,
        ColComponent,
        MatTooltip,
        TranslocoPipe,
        ProgressBarComponent,
        RouterLink,
        JsonPipe,
        MultiSelectComponent,
        SelectComponent,
        TooltipDirective,
        FaStackItemSizeDirective
    ],
    templateUrl: './servicetemplategroups-allocate-to-host.component.html',
    styleUrl: './servicetemplategroups-allocate-to-host.component.css'
})
export class ServicetemplategroupsAllocateToHostComponent implements OnInit, OnDestroy {

    private readonly subscriptions: Subscription = new Subscription();
    private readonly ServicetemplategroupsService: ServicetemplategroupsService = inject(ServicetemplategroupsService);

    protected errors: GenericValidationError = {} as GenericValidationError;
    protected params: ServiceTemplateGroupsIndexParams = {} as ServiceTemplateGroupsIndexParams;

    protected readonly route: ActivatedRoute = inject(ActivatedRoute);
    protected selectedItems: DeleteAllItem[] = [];
    protected readonly router: Router = inject(Router);
    protected hideFilter: boolean = true;

    protected servicetemplategroups: SelectKeyValue[] = [];
    protected hosts: SelectKeyValue[] = [];
    protected hostsWithServicetemplatesForDeploy: AllocateToHostGetServicetemplatesForDeploy[] = [];

    protected servicetemplategroupId: number = 0;
    protected hostId: number | null = null;

    protected percentage: number = 42;

    public ngOnInit() {
        this.servicetemplategroupId = Number(this.route.snapshot.paramMap.get('id'));
        this.loadServicetemplategroups('');
        this.loadHosts('');
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }


    private loadServices(): void {
        if (this.servicetemplategroupId === null || this.hostId === null) {
            return;
        }
        this.ServicetemplategroupsService.allocateToHostGet(this.servicetemplategroupId, this.hostId).subscribe(
            (result: AllocateToHostGet): void => {
                this.hostsWithServicetemplatesForDeploy = result.servicetemplatesForDeploy
            }
        )
    }

    protected hostIdChanged(): void {
        this.loadServices();
    }

    protected selectAll(): void {
        if (typeof this.hostsWithServicetemplatesForDeploy === "undefined") {
            return;
        }
        for (var hostIndex in this.hostsWithServicetemplatesForDeploy) {
            this.hostsWithServicetemplatesForDeploy[hostIndex].createServiceOnTargetHost = true;
        }
    }

    protected undoSelection(): void {

        if (typeof this.hostsWithServicetemplatesForDeploy === "undefined") {
            return;
        }
        for (var hostIndex in this.hostsWithServicetemplatesForDeploy) {
            this.hostsWithServicetemplatesForDeploy[hostIndex].createServiceOnTargetHost = false;
        }
    }


    private isProcessing: boolean = false;
    private readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService: NotyService = inject(NotyService);

    protected allocateToHost(): void {
        let item: AllocateToHostPost =
            {
                Host: {
                    id: this.hostId as number
                },
                Servicetemplates: {
                    _ids: []
                }
            };
        for (var hostIndex in this.hostsWithServicetemplatesForDeploy) {
            if (this.hostsWithServicetemplatesForDeploy[hostIndex].createServiceOnTargetHost) {
                item.Servicetemplates._ids.push(this.hostsWithServicetemplatesForDeploy[hostIndex].servicetemplate.id);
            }
        }
        this.isProcessing = true;
        let i = 0;
        let count = 42;
        this.ServicetemplategroupsService.allocateToHost(this.servicetemplategroupId, item);


        this.subscriptions.add(this.ServicetemplategroupsService.allocateToHost(this.servicetemplategroupId, item)
            .subscribe((result: GenericResponseWrapper) => {
                if (result.success) {
                    i++;
                    this.percentage = Math.round(i / count * 100);

                    this.notyService.genericSuccess();
                    this.router.navigate(['/servicetemplategroups/index']);
                    return;
                }

                // Error
                this.notyService.genericError();
                const errorResponse: GenericValidationError = result.data as GenericValidationError;
                if (result) {
                    this.errors = errorResponse;
                }
            })
        );
    }

    /*******************
     * ARROW functions *
     *******************/
    protected loadServicetemplategroups = (containerName: string): void => {
        this.subscriptions.add(this.ServicetemplategroupsService.loadServicetemplategroupsByString(containerName)
            .subscribe((result: LoadServicetemplategroupsByString): void => {
                this.servicetemplategroups = result.servicetemplategroups;
            }))
    }

    protected loadHosts = (containerName: string): void => {
        this.subscriptions.add(this.ServicetemplategroupsService.loadHostsByString(this.hostId as number, containerName)
            .subscribe((result: LoadHostsByStringResponse): void => {
                this.hosts = result.hosts;
            }))
    }

}
