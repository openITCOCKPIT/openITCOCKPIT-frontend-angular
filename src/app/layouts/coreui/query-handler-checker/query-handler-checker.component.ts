import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AlertComponent } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { QueryHandler } from './query-handler.interfaces';
import { Subscription } from 'rxjs';
import { QueryHandlerService } from './query-handler.service';


@Component({
    selector: 'oitc-query-handler-checker',
    imports: [
        AlertComponent,
        TranslocoDirective,
        FaIconComponent
    ],
    templateUrl: './query-handler-checker.component.html',
    styleUrl: './query-handler-checker.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryHandlerCheckerComponent implements OnInit, OnDestroy {
    public showError: boolean = false;

    public queryHandler: QueryHandler = {
        exists: false,
        path: '',
        isContainer: false
    };

    private readonly QueryHandlerService = inject(QueryHandlerService);

    private subscriptions: Subscription = new Subscription();

    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        this.subscriptions.add(
            this.QueryHandlerService.load().subscribe(queryHandler => {
                this.queryHandler = queryHandler;

                this.showError = false;
                if (!queryHandler.exists && !queryHandler.isContainer) {
                    this.showError = true;
                }
                this.cdr.markForCheck();
            })
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}
