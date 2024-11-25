import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
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
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';

@Component({
    selector: 'oitc-interval-picker',
    standalone: true,
    imports: [
        DropdownComponent,
        FaIconComponent,
        XsButtonDirective,
        DropdownToggleDirective,
        RowComponent,
        ColComponent,
        DropdownMenuDirective,
        NgClass,
        NgIf,
        TranslocoDirective,
        NgForOf
    ],
    templateUrl: './interval-picker.component.html',
    styleUrl: './interval-picker.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntervalPickerComponent {
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

    @Input() public selectedAutoRefresh: SelectKeyValue = this.refreshRates[0]
    @Output() change = new EventEmitter<SelectKeyValue>();

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);


    public ngOnInit(): void {
        this.setHumanNames();
        this.cdr.markForCheck();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public changeRefresh(refreshValue: SelectKeyValue) {
        this.selectedAutoRefresh = refreshValue;

        this.setHumanNames();
        this.cdr.markForCheck();

        this.change.emit(refreshValue);
    }

    private setHumanNames(): void {
        this.cdr.markForCheck()
    }

}
