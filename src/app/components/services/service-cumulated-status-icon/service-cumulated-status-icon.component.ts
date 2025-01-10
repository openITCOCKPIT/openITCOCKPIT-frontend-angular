import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';

@Component({
    selector: 'oitc-service-cumulated-status-icon',
    imports: [
        FaIconComponent,
        NgClass
    ],
    templateUrl: './service-cumulated-status-icon.component.html',
    styleUrl: './service-cumulated-status-icon.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceCumulatedStatusIconComponent {
    protected iconColor: string = 'text-muted';

    public cumulatedState = input<number>(-1);

    private cdr = inject(ChangeDetectorRef);

    constructor() {
        effect(() => {
            switch (this.cumulatedState()) {
                case 0:  //OK
                    this.iconColor = 'text-success';
                    break;
                case 1:  //WARNING
                    this.iconColor = 'text-warning';
                    break;
                case 2:  //CRITICAL
                    this.iconColor = 'text-danger';
                    break;
                case 3:  //UNKNOWN
                    this.iconColor = 'text-muted';
                    break;
                default: //NOT IN MONITORING
                    this.iconColor = 'text-primary';
                    break;
            }
            this.cdr.markForCheck();
        });
    }
}
