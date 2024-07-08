import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IntervalInput } from '../interval-input/interval-input.interface';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    ButtonGroupComponent,
    ColComponent,
    FormControlDirective,
    InputGroupComponent,
    RowComponent
} from '@coreui/angular';
import { HumanTimeComponent } from '../interval-input/human-time/human-time.component';
import { NgForOf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XsButtonDirective } from '../xsbutton-directive/xsbutton.directive';

@Component({
    selector: 'oitc-duration-input',
    standalone: true,
    imports: [
        ButtonGroupComponent,
        ColComponent,
        FormControlDirective,
        HumanTimeComponent,
        InputGroupComponent,
        NgForOf,
        ReactiveFormsModule,
        RowComponent,
        TranslocoPipe,
        XsButtonDirective,
        FormsModule
    ],
    templateUrl: './duration-input.component.html',
    styleUrl: './duration-input.component.css'
})
export class DurationInputComponent {
    private readonly TranslocoService = inject(TranslocoService);

    public interval: IntervalInput[] = [];

    @Input() id: string | undefined;
    @Input() name: string = '';

    /** The selected interval in minutes */
    @Input() public selectedInterval: number = 0;
    @Output() selectedIntervalChange = new EventEmitter<number>();

    public constructor() {
        this.interval = [
            {
                interval: 1,
                short: this.TranslocoService.translate('1m'),
                long: this.TranslocoService.translate('1 minute')
            },
            {
                interval: 2,
                short: this.TranslocoService.translate('2m'),
                long: this.TranslocoService.translate('2 minutes')
            },
            {
                interval: 5,
                short: this.TranslocoService.translate('5m'),
                long: this.TranslocoService.translate('5 minutes')
            },
            {
                interval: 10,
                short: this.TranslocoService.translate('10m'),
                long: this.TranslocoService.translate('10 minutes')
            },
            {
                interval: 15,
                short: this.TranslocoService.translate('15m'),
                long: this.TranslocoService.translate('15 minutes')
            },
            {
                interval: 30,
                short: this.TranslocoService.translate('30m'),
                long: this.TranslocoService.translate('30 minutes')
            },
            {
                interval: 45,
                short: this.TranslocoService.translate('45m'),
                long: this.TranslocoService.translate('45 minutes')
            },
            {
                interval: 60,
                short: this.TranslocoService.translate('1h'),
                long: this.TranslocoService.translate('1 hour')
            },
            {
                interval: (1.5 * 60),
                short: this.TranslocoService.translate('1.5h'),
                long: this.TranslocoService.translate('1.5 hours')
            },
            {
                interval: (2 * 60),
                short: this.TranslocoService.translate('2h'),
                long: this.TranslocoService.translate('2 hours')
            },
            {
                interval: (4 * 60),
                short: this.TranslocoService.translate('4h'),
                long: this.TranslocoService.translate('4 hours')
            },
            {
                interval: (8 * 60),
                short: this.TranslocoService.translate('8h'),
                long: this.TranslocoService.translate('8 hours')
            }
        ];
    }

    public updateInterval() {
        this.selectedIntervalChange.emit(this.selectedInterval);
    }

    public changeInterval(interval: number): void {
        this.selectedInterval = interval;
        this.selectedIntervalChange.emit(interval);
    }
}
