import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { CurrentStateReportPerfdataArrayValue } from '../../currentstatereports.interface';
import { NgClass } from '@angular/common';

@Component({
    selector: 'oitc-currentstatereport-perfdata-gauge',
    standalone: true,
    imports: [
        NgClass
    ],
    templateUrl: './currentstatereport-perfdata-gauge.component.html',
    styleUrl: './currentstatereport-perfdata-gauge.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentstatereportPerfdataGaugeComponent implements OnInit {
    @Input() public gauge!: CurrentStateReportPerfdataArrayValue;

    public percentage: number = 0;
    public backgroundColorClass: string = 'bg-ok';
    public label: string = '';

    private cdr = inject(ChangeDetectorRef);

    public ngOnInit(): void {
        const start = this.gauge.min !== null ? parseFloat(this.gauge.min) : 0;
        const end = this.gauge.max !== null ? parseFloat(this.gauge.max) : (this.gauge.critical !== null ? parseFloat(this.gauge.critical) : 0);
        const currentValue = this.gauge.current !== null ? parseFloat(this.gauge.current) : 0;
        const warningValue = this.gauge.warning !== null ? parseFloat(this.gauge.warning) : 0;
        const criticalValue = this.gauge.critical !== null ? parseFloat(this.gauge.critical) : 0;
        const unit = this.gauge.unit !== null ? this.gauge.unit : '';
        const label = this.gauge.metric;

        const okColor = 'bg-ok';
        const warningColor = 'bg-warning';
        const criticalColor = 'bg-critical';
        let backgroundColorClass = okColor;

        if (currentValue >= warningValue) {
            backgroundColorClass = warningColor;
        }
        if (currentValue >= criticalValue) {
            backgroundColorClass = criticalColor;
        }

        this.backgroundColorClass = backgroundColorClass;

        if (unit === '%') {
            this.percentage = (currentValue <= 100) ? currentValue : 100;
        } else {
            let percentage = (currentValue - start) / (end - start) * 100;
            if (percentage < 0 || isNaN(percentage)) {
                percentage = 0;
            }
            this.percentage = percentage;
        }

        this.label = `${currentValue} ${unit} | ${label}`;
        this.cdr.markForCheck();
    }

}
