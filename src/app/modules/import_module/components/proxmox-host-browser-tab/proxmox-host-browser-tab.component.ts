import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ExternalSystemsService } from '../../pages/externalsystems/external-systems.service';
import {
    AlertComponent,
    CardBodyComponent,
    CardComponent,
    CardSubtitleDirective,
    CardTextDirective,
    CardTitleDirective,
    ColComponent,
    ProgressComponent,
    RowComponent, TextColorDirective
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { AdditionalHostInformationProxmoxResult } from './proxmox-api.interface';
import { TranslocoDirective } from '@jsverse/transloco';
import { PatchstatusIconComponent } from '../../../../pages/patchstatus/patchstatus-icon/patchstatus-icon.component';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'oitc-proxmox-host-browser-tab',
    imports: [
        RowComponent,
        ColComponent,
        ProgressComponent,
        CardComponent,
        CardBodyComponent,
        CardTitleDirective,
        CardSubtitleDirective,
        FaIconComponent,
        CardTextDirective,
        XsButtonDirective,
        TranslocoDirective,
        AlertComponent,
        PatchstatusIconComponent,
        DecimalPipe,
        TextColorDirective
    ],
    templateUrl: './proxmox-host-browser-tab.component.html',
    styleUrl: './proxmox-host-browser-tab.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProxmoxHostBrowserTabComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public hostId: number = 0;
    @Input() public hostname: string = '';
    @Input() public lastUpdated?: Date; // Change the date to trigger an update from an external component

    public result?: AdditionalHostInformationProxmoxResult;

    public vmid?: string
    public nodeName?: string

    private subscriptions: Subscription = new Subscription();

    private readonly ExternalSystemsService = inject(ExternalSystemsService);

    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['hostId']) {
            this.load();
            return;
        }

        // Parent component wants to trigger an update
        if (changes['lastUpdated'] && !changes['lastUpdated'].isFirstChange()) {
            //this.load();
            return;
        }

    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public load(): void {
        this.subscriptions.add(this.ExternalSystemsService.getAdditionalHostInformationWithType<AdditionalHostInformationProxmoxResult>(this.hostId)
            .subscribe((result) => {
                // We use the same API endpoint as the other external systems do, but the data we receive is different.

                this.result = result;
                this.nodeName = result.response.info?.node;
                this.vmid = result.response.info?.vmid.toString();
                this.cdr.markForCheck();
            })
        );
    }
}
