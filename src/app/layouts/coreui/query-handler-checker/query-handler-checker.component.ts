import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AlertComponent } from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { QueryHandler } from './query-handler.interfaces';
import { Subscription } from 'rxjs';
import { QueryHandlerService } from './query-handler.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'oitc-query-handler-checker',
    standalone: true,
    imports: [
        AlertComponent,
        TranslocoDirective,
        FaIconComponent,
        NgIf
    ],
    templateUrl: './query-handler-checker.component.html',
    styleUrl: './query-handler-checker.component.css'
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

    public ngOnInit(): void {
        this.subscriptions.add(
            this.QueryHandlerService.load().subscribe(queryHandler => {
                this.queryHandler = queryHandler;

                this.showError = false;
                if (!queryHandler.exists && !queryHandler.isContainer) {
                    this.showError = true;
                }
            })
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

}
