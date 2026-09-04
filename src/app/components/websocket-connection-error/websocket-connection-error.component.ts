import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { TooltipDirective } from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Subscription } from 'rxjs';
import { WebSocketsService } from '../../services/web-sockets.service';

@Component({
    selector: 'oitc-websocket-connection-error',
    imports: [
        TranslocoPipe,
        TooltipDirective,
        FaIconComponent
    ],
    templateUrl: './websocket-connection-error.component.html',
    styleUrl: './websocket-connection-error.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebsocketConnectionErrorComponent implements OnInit, OnDestroy {

    private readonly subscriptions: Subscription = new Subscription();
    private readonly WebSocketsService: WebSocketsService = inject(WebSocketsService);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);


    public showError: boolean = false;

    public ngOnInit(): void {
        // Wo do not connect or establish a WebSocket connection in this component, so calling
        // acquire() or release() is not required
        // We only subscripe to the error subject to keep track of connections errors
        this.subscriptions.add(
            this.WebSocketsService.connectionError$.subscribe(isError => {
                this.showError = isError;
                this.cdr.markForCheck();
            })
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}

