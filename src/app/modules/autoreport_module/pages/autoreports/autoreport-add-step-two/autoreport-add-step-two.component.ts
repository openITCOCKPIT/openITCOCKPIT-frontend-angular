import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../../../permissions/permission.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    BadgeComponent,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective, ColComponent, FormCheckComponent, FormCheckInputDirective, FormControlDirective,
    FormDirective, FormLabelDirective, InputGroupComponent, InputGroupTextDirective, RowComponent
} from '@coreui/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectComponent } from '../../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { Subscription } from 'rxjs';
import { AutoreportsService } from '../autoreports.service';
import {
    AutoreportObject,
    HostServiceParams,
    AutoReportHostWithServicesObject,
    PostAutoreport
} from '../autoreports.interface';
import { SelectKeyValueExtended } from '../../../../../pages/statuspages/statuspage.interface';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { GenericValidationError } from '../../../../../generic-responses';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { NgForOf, NgIf } from '@angular/common';
import _ from 'lodash';

@Component({
    selector: 'oitc-autoreport-add-step-two',
    imports: [
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective,
        RouterLink,
        FormDirective,
        FormsModule,
        ReactiveFormsModule,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        CardBodyComponent,
        BadgeComponent,
        RowComponent,
        TranslocoPipe,
        FormLabelDirective,
        MultiSelectComponent,
        RequiredIconComponent,
        ColComponent,
        FormErrorDirective,
        SelectComponent,
        FormFeedbackComponent,
        DebounceDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TrueFalseDirective,
        NgIf,
        NgForOf
    ],
    templateUrl: './autoreport-add-step-two.component.html',
    styleUrl: './autoreport-add-step-two.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoreportAddStepTwoComponent implements OnInit, OnDestroy {


    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private subscriptions: Subscription = new Subscription();
    private readonly AutoreportsService: AutoreportsService = inject(AutoreportsService);
    private cdr = inject(ChangeDetectorRef);

    public errors: GenericValidationError | null = null;
    public id: number = 0;
    public autoreport!: AutoreportObject;
    public selectedHostIds: number[] = [];
    public hosts: SelectKeyValue[] = [];
    public servicenameRegex: string | null = '';
    public selectedSelectedIds: number[] = [];
    public post: PostAutoreport = {
        Autoreport: {
            hosts: [],
            services: []
        }
    };
    public hostsWithServices: AutoReportHostWithServicesObject[] = [];
    public serviceIdsToConsider: number[] = [];


    public defaultOptionsPercent = 0;
    public defaultOptionsMinute = 0;
    public defaultOptionsAliasGraph = 0;
    public defaultOptionsGraphSettings = 'AVERAGE';
    public defaultOptionsOutageDuration = '';
    public defaultOptionsAllfailures = 0;

    public ngOnInit(): void {
        this.id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadReport();
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public loadReport() {
        this.subscriptions.add(this.AutoreportsService.getAddStepTwo(this.id).subscribe((result) => {
            this.autoreport = result;
            this.loadHosts('');
            this.cdr.markForCheck();
        }));
    }

    public loadHosts = (searchString: string) => {
        this.subscriptions.add(this.AutoreportsService.loadHosts(this.autoreport.container_id, searchString, this.selectedHostIds)
            .subscribe((result) => {
                this.hosts = result;
                this.cdr.markForCheck();
            })
        );
    }

    public onSelectChange(event: any) {
        const params: HostServiceParams = {
            'angular': true,
            'hostIds[]': this.selectedHostIds,
            'servicenameRegex': this.servicenameRegex,
            'selected[]': this.selectedSelectedIds
        };
        this.subscriptions.add(this.AutoreportsService.loadServicesWithHostByHostIds(params)
            .subscribe((result) => {
                this.hostsWithServices = result.hostsWithServices;
                this.serviceIdsToConsider = result.serviceIdsList;
                this.buildPost();


            })
        );
        this.cdr.markForCheck();
    }

    public onDefaultOptionPercentChange(event: any) {
        this.updateDefaultOption('percent', this.defaultOptionsPercent);
    }

    public onDefaultOptionMinuteChange(event: any) {
        this.updateDefaultOption('minute', this.defaultOptionsMinute);
    }

    public onDefaultOptionAliasGraphChange(event: any) {
        this.updateDefaultOption('alias', this.defaultOptionsAliasGraph);
    }

    public onDefaultOptionsGraphSettingsChange(event: any) {
        this.updateDefaultOption('graphSettings', this.defaultOptionsGraphSettings);
    }

    public onDefaultOptionsOutageDurationChange(event: any) {
        this.updateDefaultOption('outage', this.defaultOptionsOutageDuration);
    }

    public onDefaultOptionsAllfailuresChange(event: any){
        this.updateDefaultOption('allfailures', this.defaultOptionsAllfailures);
    }

    protected updateDefaultOption(field: string ,value: any) {
        if(field === 'outage' && Number(value) < 0) {
            return;
        }

        for(const hostId in this.post.Autoreport.hosts) {
            if(field === 'graphSettings') {
                continue;
            }
            // @ts-ignore
            this.post.Autoreport.hosts[hostId][field] = value;
        }

        for(const serviceId in this.post.Autoreport.services) {
            if(field === 'alias') {
                this.post.Autoreport.services[serviceId].graph = value;
            } else {
                // @ts-ignore
                this.post.Autoreport.services[serviceId][field] = value;
            }
        }

    }

    protected buildPost() {
        for (const hostIndex in this.hostsWithServices) {
            const hostId = this.hostsWithServices[hostIndex].id;
            //Do not overwrite already selected host report options
            if (!this.post.Autoreport.hosts.hasOwnProperty(hostId)) {
                this.post.Autoreport.hosts[hostId] = {
                    host_id: hostId,
                    percent: 0,
                    minute: 0,
                    alias: 0,
                    outage: '',
                    allfailures: 0
                };
            }

            for (const serviceIndex in this.hostsWithServices[hostIndex].services) {
                const serviceId = this.hostsWithServices[hostIndex].services[serviceIndex].id;

                //Do not overwrite already selected service report options
                if (!this.post.Autoreport.services.hasOwnProperty(serviceId)) {
                    this.post.Autoreport.services[serviceId] = {
                        host_id: hostId,
                        service_id: serviceId,
                        percent: 0,
                        minute: 0,
                        graph: 0,
                        graphSettings: 'AVERAGE',
                        outage: '',
                        allfailures: 0
                    };
                }
            }
            var idsToDelete = _.difference(_.map(_.keys(this.post.Autoreport.services), Number), this.serviceIdsToConsider);
            this.cleanUpForServiceOptions(idsToDelete);
            this.cdr.markForCheck();
        }
    }


    protected cleanUpForServiceOptions(serviceIdsToDelete: number[]) {
        if (serviceIdsToDelete.length === 0) {
            return;
        }
        for (var index in serviceIdsToDelete) {
            var serviceId = serviceIdsToDelete[index];
            if (this.post.Autoreport.services.hasOwnProperty(serviceId)) {
                delete this.post.Autoreport.services[serviceId];
            }
        }
        this.cdr.markForCheck();
    }


    public submitAddStepTwo() {
    }

}
