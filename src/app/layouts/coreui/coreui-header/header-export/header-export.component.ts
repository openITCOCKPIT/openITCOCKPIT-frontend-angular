import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { TooltipDirective } from '@coreui/angular';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HeaderInfo } from '../header-info.service';

import { ExportSocketClientService } from './export-socket-client.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'oitc-header-export',
    imports: [
        TranslocoDirective,
        TooltipDirective,
        RouterLink,
        FaIconComponent
    ],
    templateUrl: './header-export.component.html',
    styleUrl: './header-export.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderExportComponent implements OnDestroy {
    private cdr = inject(ChangeDetectorRef);
    private readonly subscriptions: Subscription = new Subscription();
    protected sockectConnection: any = null;


    @Input({required: true}) public headerinfo: HeaderInfo = {} as HeaderInfo;
    public isRunning: boolean = false;


    constructor(public ExportSocketClientService: ExportSocketClientService) {
        this.subscriptions.add(ExportSocketClientService.getSocketConfig().subscribe((data: any) => {
            this.sockectConnection = new WebSocket(data.websocket['SUDO_SERVER.URL']);
            this.sockectConnection.onmessage = (event: any) => {
                const transmitted = JSON.parse(event.data);
                if (transmitted.type === 'dispatcher') {
                    this.isRunning = transmitted.running;
                    this.cdr.markForCheck();
                }
            };
        }));
    }

    public ngOnDestroy() {
        if (this.sockectConnection) {
            this.sockectConnection.close();
            this.sockectConnection = null;
        }
        this.subscriptions.unsubscribe();
    }

}
