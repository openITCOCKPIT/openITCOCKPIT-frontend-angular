import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    EventEmitter,
    inject,
    input,
    Input,
    OnDestroy,
    Output
} from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import {
    ColComponent,
    DropdownComponent,
    DropdownMenuDirective,
    DropdownToggleDirective,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { XsButtonDirective } from '../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { NgClass } from '@angular/common';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
    selector: 'oitc-interval-picker',
    imports: [
        DropdownComponent,
        FaIconComponent,
        XsButtonDirective,
        DropdownToggleDirective,
        RowComponent,
        ColComponent,
        DropdownMenuDirective,
        NgClass,
        TranslocoDirective
    ],
    templateUrl: './interval-picker.component.html',
    styleUrl: './interval-picker.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntervalPickerComponent implements OnDestroy {
    private readonly TranslocoService = inject(TranslocoService);

    public refreshRates: SelectKeyValue[] = [
        {key: 0, value: this.TranslocoService.translate('Disabled')},
        {key: 5, value: this.TranslocoService.translate('Refresh every 5s')},
        {key: 10, value: this.TranslocoService.translate('Refresh every 10s')},
        {key: 30, value: this.TranslocoService.translate('Refresh every 30s')},
        {key: 60, value: this.TranslocoService.translate('Refresh every 1m')},
        {key: 120, value: this.TranslocoService.translate('Refresh every 2m')},
        {key: 300, value: this.TranslocoService.translate('Refresh every 5m')},
        {key: 900, value: this.TranslocoService.translate('Refresh every 15m')}
    ];


    public useLocalStorage = input<boolean>(true);
    public initialInterval = input<number | undefined>(0); // Select 'Disabled' by default, only relevant if useLocalStorage is false

    @Input() public selectedAutoRefresh: SelectKeyValue = this.refreshRates[0]
    @Output() change = new EventEmitter<SelectKeyValue>();

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    private readonly LocalStorageService = inject(LocalStorageService);

    public constructor() {
        effect(() => {
            // Restore the selected auto refresh from local storage
            if (this.useLocalStorage()) {
                let storedRefreshRate = Number(this.LocalStorageService.getItemWithDefault('auto-refresh-rate', 0));
                if (storedRefreshRate > 1) {
                    this.refreshRates.forEach((refreshRate) => {
                        if (refreshRate.key === storedRefreshRate) {
                            this.changeRefresh(refreshRate);
                        }
                    });
                }

                this.cdr.markForCheck();
            } else {
                // If not using local storage, use the initialInterval input to set the selected auto refresh
                this.refreshRates.forEach((refreshRate) => {
                    if (refreshRate.key === this.initialInterval()) {
                        //this.changeRefresh(refreshRate);
                        this.selectedAutoRefresh = refreshRate;
                    }
                    this.cdr.markForCheck();
                });
            }
        });
    }


    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public changeRefresh(refreshValue: SelectKeyValue) {
        this.selectedAutoRefresh = refreshValue;

        if (this.useLocalStorage()) {
            this.LocalStorageService.setItem('auto-refresh-rate', String(refreshValue.key));
        }

        this.cdr.markForCheck();

        this.change.emit(refreshValue);
    }


}
