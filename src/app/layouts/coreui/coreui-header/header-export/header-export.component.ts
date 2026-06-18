import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    OnDestroy,
    OnInit,
    signal
} from '@angular/core';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { TooltipDirective } from '@coreui/angular';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Subscription } from 'rxjs';
import { WebsocketMessageType, WebSocketsService } from '../../../../services/web-sockets.service';

@Component({
    selector: 'oitc-header-export',
    imports: [
        TranslocoDirective,
        TooltipDirective,
        RouterLink,
        FaIconComponent,
        TranslocoPipe
    ],
    templateUrl: './header-export.component.html',
    styleUrl: './header-export.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderExportComponent implements OnInit, OnDestroy {

    private readonly WebSocketsService: WebSocketsService = inject(WebSocketsService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly subscriptions: Subscription = new Subscription();

    public isRefreshRunning = signal(false);

    public ngOnInit(): void {
        // Register this component as client for the reference counter
        this.WebSocketsService.acquire();

        // Subscribe to all messages on the WebSocket
        this.subscriptions.add(
            this.WebSocketsService.messages$.subscribe({
                next: (msg) => {
                    if (msg.type === WebsocketMessageType.ExportStatus) {
                        this.isRefreshRunning.set(msg.payload === true);
                    }
                }
            })
        );
    }

    public ngOnDestroy(): void {
        // Update reference counter
        this.WebSocketsService.release();
        this.subscriptions.unsubscribe();
    }

}
