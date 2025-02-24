import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'oitc-autoreport-bitwise-icon',
    imports: [
        FaIconComponent
    ],
  templateUrl: './autoreport-bitwise-icon.component.html',
  styleUrl: './autoreport-bitwise-icon.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoreportBitwiseIconComponent {
    //public optionValue = input<number>(0);
    optionValue = input.required<number>();
   // public compareValue = input<number>(0);
    compareValue = input.required<number>();
    public compare: boolean = false;

    constructor() {
        effect(() => {
            const optionValue: number = this.optionValue();
            const compareValue: number = this.compareValue();
            this.compare = Boolean(optionValue & compareValue);
        });
    }

}
