import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    Output
} from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    ButtonGroupComponent,
    ColComponent,
    FormControlDirective,
    InputGroupComponent,
    RowComponent
} from '@coreui/angular';
import { IntervalInput } from './interval-input.interface';
import { XsButtonDirective } from '../xsbutton-directive/xsbutton.directive';
import { NgClass, NgForOf } from '@angular/common';

import { PaginatorModule } from 'primeng/paginator';
import { HumanTimeComponent } from './human-time/human-time.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'oitc-interval-input',
    imports: [
    TranslocoPipe,
    RowComponent,
    ColComponent,
    ButtonGroupComponent,
    XsButtonDirective,
    NgClass,
    FormControlDirective,
    PaginatorModule,
    HumanTimeComponent,
    NgForOf,
    InputGroupComponent,
    FormsModule
],
    templateUrl: './interval-input.component.html',
    styleUrl: './interval-input.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntervalInputComponent {
    private readonly TranslocoService = inject(TranslocoService);

    public interval: IntervalInput[] = [];

    @Input() id: string | undefined;
    @Input() name: string = '';

    /** The selected interval in seconds */
    @Input() public selectedInterval: number = 0;
    @Output() selectedIntervalChange = new EventEmitter<number>();

    private cdr = inject(ChangeDetectorRef);

    public constructor() {
        this.interval = [
            {
                interval: 30,
                short: this.TranslocoService.translate('30s'),
                long: this.TranslocoService.translate('30 seconds')
            },
            {
                interval: 60,
                short: this.TranslocoService.translate('1m'),
                long: this.TranslocoService.translate('1 minute')
            },
            {
                interval: (2 * 60),
                short: this.TranslocoService.translate('2m'),
                long: this.TranslocoService.translate('2 minutes')
            },
            {
                interval: (5 * 60),
                short: this.TranslocoService.translate('5m'),
                long: this.TranslocoService.translate('5 minutes')
            },
            {
                interval: (10 * 60),
                short: this.TranslocoService.translate('10m'),
                long: this.TranslocoService.translate('10 minutes')
            },
            {
                interval: (15 * 60),
                short: this.TranslocoService.translate('15m'),
                long: this.TranslocoService.translate('15 minutes')
            },
            {
                interval: (30 * 60),
                short: this.TranslocoService.translate('30m'),
                long: this.TranslocoService.translate('30 minutes')
            },
            {
                interval: (45 * 60),
                short: this.TranslocoService.translate('45m'),
                long: this.TranslocoService.translate('45 minutes')
            },
            {
                interval: 3600,
                short: this.TranslocoService.translate('1h'),
                long: this.TranslocoService.translate('1 hour')
            },
            {
                interval: (1800 + 3600),
                short: this.TranslocoService.translate('1.5h'),
                long: this.TranslocoService.translate('1.5 hours')
            },
            {
                interval: (2 * 3600),
                short: this.TranslocoService.translate('2h'),
                long: this.TranslocoService.translate('2 hours')
            },
            {
                interval: (4 * 3600),
                short: this.TranslocoService.translate('4h'),
                long: this.TranslocoService.translate('4 hours')
            },
        ];
        //this.cdr.markForCheck();
    }

    public updateInterval() {
        this.selectedIntervalChange.emit(this.selectedInterval);
    }

    public changeInterval(interval: number): void {
        this.selectedInterval = interval;
        this.selectedIntervalChange.emit(interval);
    }

}
