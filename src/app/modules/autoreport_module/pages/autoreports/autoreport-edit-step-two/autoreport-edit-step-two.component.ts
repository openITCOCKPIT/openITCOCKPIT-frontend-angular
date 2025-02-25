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
    PostAutoreport,
} from '../autoreports.interface';
import { SelectKeyValue } from '../../../../../layouts/primeng/select.interface';
import { RequiredIconComponent } from '../../../../../components/required-icon/required-icon.component';
import { FormErrorDirective } from '../../../../../layouts/coreui/form-error.directive';
import { SelectComponent } from '../../../../../layouts/primeng/select/select/select.component';
import { FormFeedbackComponent } from '../../../../../layouts/coreui/form-feedback/form-feedback.component';
import { GenericResponseWrapper, GenericValidationError } from '../../../../../generic-responses';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';
import { NgForOf, NgIf } from '@angular/common';
import { NotyService } from '../../../../../layouts/coreui/noty.service';
import {HostsService} from '../../../../../pages/hosts/hosts.service';
import _ from 'lodash';

@Component({
  selector: 'oitc-autoreport-edit-step-two',
    imports: [
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
        FormFeedbackComponent,
        DebounceDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TrueFalseDirective,
        NgIf,
        NgForOf,
        TranslocoDirective,
        FaIconComponent
    ],
  templateUrl: './autoreport-edit-step-two.component.html',
  styleUrl: './../../../assets/autoreport.css', //'./autoreport-edit-step-two.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoreportEditStepTwoComponent implements OnInit, OnDestroy {

    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private subscriptions: Subscription = new Subscription();
    private readonly AutoreportsService: AutoreportsService = inject(AutoreportsService);
    private readonly HostsService: HostsService = inject(HostsService);
    private readonly notyService = inject(NotyService);
    private cdr = inject(ChangeDetectorRef);

    public init:boolean = false;
    public errors: GenericValidationError | null = null;
    public id: number = 0;
    public autoreport!: AutoreportObject;
    public selectedHostIds: number[] = [];
    public hosts: SelectKeyValue[] = [];
    public servicenameRegex: string | null = '';
    public selectedSelectedIds: number[] = [];
    public post: PostAutoreport = {
        Autoreport: {
            hosts:  [],
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
        this.subscriptions.add(this.AutoreportsService.getEditStepTwo(this.id).subscribe((result) => {
            this.autoreport = result.autoreport;
            this.selectedHostIds = (result.selectedHostIds) ? result.selectedHostIds : [];
           // this.hostsWithServices = (this.autoreport.hostsWithServices) ? this.autoreport.hostsWithServices : [];
             if(result.autoreport.POST?.hosts){
                 const hosts = Object.values(result.autoreport.POST?.hosts);
                 let hostArray = [];
                 for(let host of hosts){
                     // @ts-ignore
                     hostArray[host.host_id] = host;
                 }
                    // @ts-ignore
                 this.post.Autoreport.hosts = hostArray;
             }
            if(result.autoreport.POST?.services){
                const services = Object.values(result.autoreport.POST?.services);
                let serviceArray = [];
                for(let service of services){
                    // @ts-ignore
                    serviceArray[service.service_id] = service;
                }
                // @ts-ignore
                this.post.Autoreport.services = serviceArray;
            }
            this.onHostChange('');
            //this.post.Autoreport.hosts = this.autoreport.POST.hosts;
            //this.post.Autoreport.services = this.autoreport.POST.services;

            this.init = true;
            this.cdr.markForCheck();
            this.loadHosts('');


        }));
    }

    public loadHosts = (searchString: string) => {
        this.subscriptions.add(this.HostsService.loadHostsByContainerId(this.autoreport.container_id, searchString, this.selectedHostIds)
            .subscribe((result) => {
                this.hosts = result;
                this.cdr.markForCheck();
            })
        );
    }

    public onServiceChange(event: any) {
        if(this.selectedHostIds.length === 0){
            return;
        }
        this.selectedServices();
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
                this.cdr.markForCheck();
                this.buildPost();

            })
        );
    }

    public onHostChange(event: any){
        if(this.selectedHostIds.length === 0){
            this.post.Autoreport.hosts = [];
            this.post.Autoreport.services = [];
            this.selectedSelectedIds = [];
            return;
        } else{
            let deletedHostIds = [];
            for(let hostId in this.post.Autoreport.hosts){
                //  hostId = parseInt(hostId, 10);
                if(this.selectedHostIds.indexOf(Number(hostId)) === -1){
                    delete this.post.Autoreport.hosts[hostId];
                    deletedHostIds.push(hostId);
                }
            }

            //Also delete services of deleted hosts
            if(deletedHostIds.length > 0){
                for(let serviceId in this.post.Autoreport.services){
                    let hostId = Number(this.post.Autoreport.services[serviceId].host_id);
                    if(this.selectedHostIds.indexOf(hostId) === -1){
                        //host was removed from selectbox
                        delete this.post.Autoreport.services[serviceId];
                    }
                }
            }
            //this.cdr.markForCheck();
        }
        this.selectedServices();
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

            //this.post.Autoreport.hosts[hostId][field] = value;

            (this.post.Autoreport.hosts[hostId] as Record<string, any>)[field] = value;
        }

        for(const serviceId in this.post.Autoreport.services) {
            if(field === 'alias') {
                this.post.Autoreport.services[serviceId].graph = value;
            } else {

                // this.post.Autoreport.services[serviceId][field] = value;

                (this.post.Autoreport.services[serviceId] as Record<string, any>)[field] = value;
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
            let idsToDelete = _.difference(_.map(_.keys(this.post.Autoreport.services), Number), this.serviceIdsToConsider);
            this.cleanUpForServiceOptions(idsToDelete);
            this.cdr.markForCheck();
        }
    }

    protected selectedServices() {

        this.selectedSelectedIds = [];
        if(this.post.Autoreport.services.length === 0){
            return;
        }
        for(const index in this.post.Autoreport.services){
            if(this.post.Autoreport.services[index]['percent'] || this.post.Autoreport.services[index]['minute']){
                this.selectedSelectedIds.includes(this.post.Autoreport.services[index]['service_id']);
                if(!this.selectedSelectedIds.includes(this.post.Autoreport.services[index]['service_id'])){
                    this.selectedSelectedIds.push(this.post.Autoreport.services[index]['service_id']);
                }
            }
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
        //this.cdr.markForCheck();
    }


    public submitEditStepTwo() {
        this.errors = null;
        this.subscriptions.add(this.AutoreportsService.setEditStepTwo(this.id, this.post).subscribe((result: GenericResponseWrapper): void => {
                    if (result.success) {
                        this.errors = null;
                        this.router.navigate(['/autoreport_module/autoreports/editStepThree', result.data.autoreport.id]);
                    } else {
                        this.errors = result.data as GenericValidationError;
                        this.notyService.genericError();
                    }

                    this.cdr.markForCheck();
                }
            )
        );
    }

}
