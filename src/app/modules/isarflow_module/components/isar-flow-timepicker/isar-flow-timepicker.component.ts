import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { IsarFlowTimepickerChange } from '../isar-flow-timepicker.interface';
import {
    ColComponent,
    DropdownComponent,
    DropdownMenuDirective,
    DropdownToggleDirective,
    RowComponent
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-isar-flow-timepicker',
    imports: [
        ColComponent,
        DropdownComponent,
        DropdownMenuDirective,
        DropdownToggleDirective,
        FaIconComponent,
        NgForOf,
        NgIf,
        RowComponent,
        TranslocoDirective,
        XsButtonDirective,
        NgClass
    ],
    templateUrl: './isar-flow-timepicker.component.html',
    styleUrl: './isar-flow-timepicker.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IsarFlowTimepickerComponent implements OnInit, OnDestroy {

    public selectedDurationHuman: string = '';

    @Input() public selectedDuration: number = (3600 * 6);
    @Output() change = new EventEmitter<IsarFlowTimepickerChange>();

    private readonly TranslocoService = inject(TranslocoService);
    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    public timeranges = [
        {duration: (3600 * 6), name: this.TranslocoService.translate('Last 6 hours')},
        {duration: (3600 * 24), name: this.TranslocoService.translate('Last 24 hours')},
        {duration: (3600 * 24 * 7), name: this.TranslocoService.translate('Last 7 days')},
        {duration: (3600 * 24 * 30), name: this.TranslocoService.translate('Last 30 days')},
        {duration: (3600 * 24 * 90), name: this.TranslocoService.translate('Last 90 days')},
    ];

    public ngOnInit(): void {
        this.cdr.markForCheck();

        // Find timerange name by key for default value
        this.selectedDurationHuman = this.timeranges.find((timerange) => timerange.duration === this.selectedDuration)?.name || '';
    }


    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public changeDuration(duration: number, name: string) {
        this.selectedDuration = duration;
        this.selectedDurationHuman = name;

        this.change.emit({
            duration: this.selectedDuration
        });
    }
}
