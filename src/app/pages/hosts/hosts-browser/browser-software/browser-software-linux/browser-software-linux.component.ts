import { ChangeDetectionStrategy, Component, inject, input, InputSignal, OnDestroy, OnInit } from '@angular/core';
import { IndexPage } from '../../../../../pages.interface';
import { Sort } from '@angular/material/sort';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { Subscription } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';

@Component({
    selector: 'oitc-browser-software-linux',
    imports: [],
    templateUrl: './browser-software-linux.component.html',
    styleUrl: './browser-software-linux.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowserSoftwareLinuxComponent implements OnInit, OnDestroy, IndexPage {
    public hostId: InputSignal<number> = input<number>(0);

    private subscription: Subscription = new Subscription();
    private readonly TranslocoService = inject(TranslocoService);

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    toggleFilter(): void {
        throw new Error('Method not implemented.');
    }

    resetFilter(): void {
        throw new Error('Method not implemented.');
    }

    onPaginatorChange(change: PaginatorChangeEvent): void {
        throw new Error('Method not implemented.');
    }

    onFilterChange(event: Event): void {
        throw new Error('Method not implemented.');
    }

    onSortChange(sort: Sort): void {
        throw new Error('Method not implemented.');
    }

    onMassActionComplete(success: boolean): void {
        throw new Error('Method not implemented.');
    }
}
