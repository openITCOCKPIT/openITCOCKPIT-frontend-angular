import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { GlobalLoadingService } from '../../../global-loading.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
    selector: 'oitc-global-loader',
    standalone: true,
    imports: [],
    templateUrl: './global-loader.component.html',
    styleUrl: './global-loader.component.css',
    animations: [
        trigger('fade', [
            state('visible', style({opacity: 1, display: 'block'})),
            state('hidden', style({opacity: 0, display: 'none'})),
            transition('visible => hidden', animate('0.6s ease-out')),
            transition('hidden => visible', style('*')),
        ])],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GlobalLoaderComponent implements OnInit, OnDestroy {

    public isLoaderVisible: boolean = true;
    private subscriptions: Subscription = new Subscription();

    private cdr = inject(ChangeDetectorRef);

    constructor(public loader: GlobalLoadingService) {
    }

    public ngOnInit() {
        this.subscriptions.add(this.loader.isLoading$.subscribe(loading => {
            this.isLoaderVisible = loading;
            this.cdr.markForCheck();
        }));
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}
