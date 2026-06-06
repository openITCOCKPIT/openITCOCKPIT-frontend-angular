import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    input,
    Input,
    Output
} from '@angular/core';
import { AutomapsViewRoot } from '../../automaps.interface';
import { PaginatorChangeEvent } from '../../../../layouts/coreui/paginator/paginator.interface';
import { ColComponent, ContainerComponent, ModalService, RowComponent } from '@coreui/angular';

import {
    PaginateOrScrollComponent
} from '../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { BadgeOutlineComponent } from '../../../../layouts/coreui/badge-outline/badge-outline.component';


import { ServicestatusIconAutomapComponent } from './servicestatus-icon-automap/servicestatus-icon-automap.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { LabelLinkComponent } from '../../../../layouts/coreui/label-link/label-link.component';

import { PermissionsService } from '../../../../permissions/permissions.service';


import {
    ServiceBrowserModalComponent
} from '../../../services/services-browser/service-browser-modal/service-browser-modal.component';
import {
    ServiceBrowserModalService
} from '../../../services/services-browser/service-browser-modal/service-browser-modal.service';

@Component({
    selector: 'oitc-automap-viewer',
    imports: [
        ColComponent,
        ContainerComponent,
        PaginateOrScrollComponent,
        RowComponent,
        TranslocoDirective,
        BadgeOutlineComponent,
        ServicestatusIconAutomapComponent,
        FaIconComponent,
        LabelLinkComponent,
        ServiceBrowserModalComponent
    ],
    templateUrl: './automap-viewer.component.html',
    styleUrl: './automap-viewer.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutomapViewerComponent {

    @Input() public automapResult!: AutomapsViewRoot;

    // Avoids to have two (or more) modals on the dashboard.
    public includeServicesBrowserModal = input<boolean>(true);
    @Output() paginatorChange = new EventEmitter<PaginatorChangeEvent>();
    @Output() reload = new EventEmitter<boolean>();

    private readonly PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly modalService: ModalService = inject(ModalService);
    private readonly ServiceBrowserModalService: ServiceBrowserModalService = inject(ServiceBrowserModalService);
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

            this.ServiceBrowserModalService.openServiceBrowserModal(serviceId);
            this.cdr.markForCheck();

            // Give angular some time to pass the service id to the template which passed it to the modal
            // this is probably wrong
            //setTimeout(() => {
            //    this.cdr.markForCheck();
            //    this.modalService.toggle({
            //        show: true,
            //        id: 'automapServiceDetailsModal'
            //    });
            //}, 150);


        });
    }

    protected readonly Number = Number;
}
