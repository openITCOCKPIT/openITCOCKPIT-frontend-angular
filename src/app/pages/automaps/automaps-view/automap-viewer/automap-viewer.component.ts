import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    Output
} from '@angular/core';
import { AutomapsViewRoot } from '../../automaps.interface';
import { PaginatorChangeEvent } from '../../../../layouts/coreui/paginator/paginator.interface';
import {
    ButtonCloseDirective,
    ButtonGroupComponent,
    ButtonToolbarComponent,
    ColComponent,
    ContainerComponent,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    RowComponent,
    TooltipDirective
} from '@coreui/angular';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import {
    PaginateOrScrollComponent
} from '../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { BadgeOutlineComponent } from '../../../../layouts/coreui/badge-outline/badge-outline.component';
import {
    ServicestatusSimpleIconComponent
} from '../../../services/servicestatus-simple-icon/servicestatus-simple-icon.component';
import {
    ServicestatusIconComponent
} from '../../../../components/services/servicestatus-icon/servicestatus-icon.component';
import { ServicestatusIconAutomapComponent } from './servicestatus-icon-automap/servicestatus-icon-automap.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { LabelLinkComponent } from '../../../../layouts/coreui/label-link/label-link.component';
import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { PermissionsService } from '../../../../permissions/permissions.service';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { ServiceStatusNamePipe } from '../../../../pipes/service-status-name.pipe';
import {
    DeleteAcknowledgementsModalComponent
} from '../../../../layouts/coreui/delete-acknowledgements-modal/delete-acknowledgements-modal.component';
import { DeleteAllModalComponent } from '../../../../layouts/coreui/delete-all-modal/delete-all-modal.component';
import {
    HostsDisableFlapdetectionModalComponent
} from '../../../../components/hosts/hosts-disable-flapdetection-modal/hosts-disable-flapdetection-modal.component';
import {
    HostsEnableFlapdetectionModalComponent
} from '../../../../components/hosts/hosts-enable-flapdetection-modal/hosts-enable-flapdetection-modal.component';
import {
    HostsSendCustomNotificationModalComponent
} from '../../../../components/hosts/hosts-send-custom-notification-modal/hosts-send-custom-notification-modal.component';
import {
    ServiceAcknowledgeModalComponent
} from '../../../../components/services/service-acknowledge-modal/service-acknowledge-modal.component';
import {
    ServiceMaintenanceModalComponent
} from '../../../../components/services/service-maintenance-modal/service-maintenance-modal.component';
import {
    ServiceResetChecktimeModalComponent
} from '../../../../components/services/service-reset-checktime-modal/service-reset-checktime-modal.component';
import {
    ServicesProcessCheckresultModalComponent
} from '../../../../components/services/services-process-checkresult-modal/services-process-checkresult-modal.component';
import {
    ServiceBrowserModalComponent
} from '../../../services/services-browser/service-browser-modal/service-browser-modal.component';

@Component({
    selector: 'oitc-automap-viewer',
    imports: [
        ColComponent,
        ContainerComponent,
        NgIf,
        PaginateOrScrollComponent,
        RowComponent,
        TranslocoDirective,
        BadgeOutlineComponent,
        ServicestatusSimpleIconComponent,
        ServicestatusIconComponent,
        ServicestatusIconAutomapComponent,
        FaIconComponent,
        LabelLinkComponent,
        RequiredIconComponent,
        NgForOf,
        ModalComponent,
        ModalHeaderComponent,
        ModalTitleDirective,
        ButtonCloseDirective,
        ModalBodyComponent,
        ModalFooterComponent,
        XsButtonDirective,
        ButtonGroupComponent,
        ButtonToolbarComponent,
        ServiceStatusNamePipe,
        TranslocoPipe,
        NgClass,
        TooltipDirective,
        DeleteAcknowledgementsModalComponent,
        DeleteAllModalComponent,
        HostsDisableFlapdetectionModalComponent,
        HostsEnableFlapdetectionModalComponent,
        HostsSendCustomNotificationModalComponent,
        ServiceAcknowledgeModalComponent,
        ServiceMaintenanceModalComponent,
        ServiceResetChecktimeModalComponent,
        ServicesProcessCheckresultModalComponent,
        ServiceBrowserModalComponent
    ],
    templateUrl: './automap-viewer.component.html',
    styleUrl: './automap-viewer.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutomapViewerComponent {

    @Input() public automapResult!: AutomapsViewRoot;
    @Output() paginatorChange = new EventEmitter<PaginatorChangeEvent>();
    @Output() reload = new EventEmitter<boolean>();

    public serviceIdForBrowser: number = 0;

    private readonly PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly modalService: ModalService = inject(ModalService);
    private cdr = inject(ChangeDetectorRef);

    // Pass reload event to parent component
    public reloadAutomap(success: boolean) {
        this.reload.emit(success);
    }

    // Pass paginator events to parent component
    public onPaginatorChange($event: PaginatorChangeEvent) {
        this.paginatorChange.emit($event);
    }

    public showServiceStatusDetails(serviceId: number) {
        this.PermissionsService.hasPermissionObservable(['services', 'browser']).subscribe(hasPermission => {
            this.serviceIdForBrowser = serviceId;
            this.cdr.markForCheck();

            // Give angular some time to pass the service id to the template which passed it to the modal
            // this is probably wrong
            setTimeout(() => {
                this.cdr.markForCheck();
                this.modalService.toggle({
                    show: true,
                    id: 'automapServiceDetailsModal'
                });
            }, 150);


        });
    }

    protected readonly Number = Number;
}
