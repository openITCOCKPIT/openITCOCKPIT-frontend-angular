import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    CardTitleDirective,
    FormControlDirective,
    FormLabelDirective,
    NavComponent
} from '@coreui/angular';
import { BackButtonDirective } from '../../../directives/back-button.directive';
import { CoreuiComponent } from '../../../layouts/coreui/coreui.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormErrorDirective } from '../../../layouts/coreui/form-error.directive';
import { FormFeedbackComponent } from '../../../layouts/coreui/form-feedback/form-feedback.component';
import { FormLoaderComponent } from '../../../layouts/primeng/loading/form-loader/form-loader.component';
import { NgForOf, NgIf } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { RequiredIconComponent } from '../../../components/required-icon/required-icon.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServiceCopyPost } from '../../services/services.interface';
import { Subscription } from 'rxjs';
import { NotyService } from '../../../layouts/coreui/noty.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ServicesService } from '../services.service';
import { SelectKeyValue } from '../../../layouts/primeng/select.interface';
import { HostsLoadHostsByStringParams } from '../../hosts/hosts.interface';
import { HostsService } from '../../hosts/hosts.service';
import { SelectComponent } from '../../../layouts/primeng/select/select/select.component';
import { HistoryService } from '../../../history.service';

@Component({
    selector: 'oitc-services-copy',
    standalone: true,
    imports: [
        AlertComponent,
        BackButtonDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        CardTitleDirective,

        FaIconComponent,
        FormControlDirective,
        FormErrorDirective,
        FormFeedbackComponent,
        FormLabelDirective,
        FormLoaderComponent,
        NavComponent,
        NgForOf,
        NgIf,
        PaginatorModule,
        PermissionDirective,
        RequiredIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        RouterLink,
        SelectComponent
    ],
    templateUrl: './services-copy.component.html',
    styleUrl: './services-copy.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesCopyComponent {

    public host_id: number = 0;
    public services: ServiceCopyPost[] = [];
    public hosts: SelectKeyValue[] = [];
    public commands: SelectKeyValue[] = [];

    private subscriptions: Subscription = new Subscription();
    private HostsService = inject(HostsService);
    private ServicesService = inject(ServicesService);
    private readonly notyService = inject(NotyService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private readonly HistoryService: HistoryService = inject(HistoryService);
    private cdr = inject(ChangeDetectorRef);


    private ids: number[] = [];

    isServicenameInUse: { [key: number]: boolean } = {};

    public ngOnInit() {
        const ids = String(this.route.snapshot.paramMap.get('ids')).split(',').map(Number);
        if (!ids) {
            // No ids given
            this.router.navigate(['/', 'services', 'index']);
        }

        this.ids = ids;
        this.loadHosts('');
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public loadHosts = (searchString: string) => {
        var selected = [];
        if (this.host_id) {
            selected.push(this.host_id);
        }

        let params: HostsLoadHostsByStringParams = {
            angular: true,
            'filter[Hosts.name]': searchString,
            'selected[]': selected,
            includeDisabled: false
        }

        this.subscriptions.add(this.HostsService.loadHostsByString(params, true)
            .subscribe((result) => {
                this.hosts = result;
                this.cdr.markForCheck();
            })
        );
    }

    public onHostChange() {
        if (this.host_id > 0) {
            this.services = [];
            this.loadServices();
            this.cdr.markForCheck();
        }
    }

    public loadServices() {
        if (this.ids) {
            this.subscriptions.add(this.ServicesService.getServicesCopy(this.ids, 1).subscribe(response => {
                this.cdr.markForCheck();
                this.commands = response.commands;

                for (let service of response.services) {

                    let s = <ServiceCopyPost>{
                        Source: {
                            id: service.id,
                            hostname: service.host.name,
                            _name: service._name
                        },
                        Service: service,
                        Error: null
                    };

                    delete s.Service.id; // important

                    this.services.push(s);
                }
            }));
        }
    }

    public loadCommandArguments(sourceServiceId: number, commandId: number, index: number) {
        this.subscriptions.add(this.ServicesService.loadCommandArguments(commandId, sourceServiceId).subscribe(response => {
            this.services[index].Service.servicecommandargumentvalues = response;
            this.cdr.markForCheck();
        }));
    }

    public copy() {
        if (this.host_id === 0) {
            return;
        }

        const sub = this.ServicesService.saveServicesCopy(this.services, this.host_id).subscribe({
            next: (value: any) => {
                //console.log(value); // Serve result with the new copied service templates
                // 200 ok
                this.notyService.genericSuccess();
                this.HistoryService.navigateWithFallback(['/', 'services', 'index']);
            },
            error: (error: HttpErrorResponse) => {
                // We run into a validation error.
                // Some service templates maybe already got created. For example when the user copied 3 service templates, and the first
                // two service templates where copied successfully, but the third one failed due to a validation error.
                //
                // The Server returns everything as the frontend expect it

                this.cdr.markForCheck();
                this.notyService.genericError();
                this.services = error.error.result as ServiceCopyPost[];
            }
        });

        this.subscriptions.add(sub);
    }
}
