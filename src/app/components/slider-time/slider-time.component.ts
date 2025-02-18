import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, inject, input, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { TranslocoService } from '@jsverse/transloco';
import { FormLabelDirective } from '@coreui/angular';

@Component({
    selector: 'oitc-slider-time',
    imports: [
        ReactiveFormsModule,
        NgClass,
        FormsModule,
        FormLabelDirective
    ],
    templateUrl: './slider-time.component.html',
    styleUrl: './slider-time.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SliderTimeComponent),
            multi: true
        }
    ]
})
export class SliderTimeComponent implements ControlValueAccessor {

    @Input() disabled: boolean = false;

    public id = input<string | undefined>(undefined);
    public name = input<string | undefined>(undefined);
    public unit = input<'seconds' | 'milliseconds'>('seconds');
    public size = input<'normal' | 'xs'>('normal');
    public label = input<string>(''); // only used for xs size

    // ngClass compatible
    public class = input<string | string[] | Set<string> | { [p: string]: any } | null | undefined>('w-100');

    public min = input<number>(0);
    public max = input<number>(900);
    public step = input<number>(10);

    public value: number = 0;

    public sliderText: string = '';
    private readonly TranslocoService = inject(TranslocoService);
    private cdr = inject(ChangeDetectorRef);

    // Default callbacks, will be passed by Angular automatically
    private onChange: (value: number) => void = () => {
    };
    private onTouched: () => void = () => {
    };

    public writeValue(value: number): void {
        this.value = value;
        this.updateTabRotationIntervalText(value);
        this.cdr.markForCheck();
    }

    public registerOnChange(fn: (value: number) => void): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
        this.cdr.markForCheck();
    }

    public onInputChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        const value = parseInt(input.value, 10);
        this.value = value;
        this.onChange(value);
        this.updateTabRotationIntervalText(value);
    }

    public updateTabRotationIntervalText(value: number): void {
        this.cdr.markForCheck();

        if (value === 0) {
            this.sliderText = this.TranslocoService.translate('disabled');
            return;
        }

        if (this.unit() === 'milliseconds') {
            // Convert to seconds for the UI
            value = value / 1000;
        }

        const minutesTrans = this.TranslocoService.translate('minutes');
        const secondsTrans = this.TranslocoService.translate('seconds');

        let min = Math.floor(value / 60);
        let sec = Math.round(value % 60);
        if (min > 0) {
            this.sliderText = `${min} ${minutesTrans}, ${sec} ${secondsTrans}`;
            return;
        }

        this.sliderText = `${sec} ${secondsTrans}`;
    }

    protected readonly String = String;
}
