import { AfterViewInit, ChangeDetectionStrategy, Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { BaseWidgetComponent } from '../../../../pages/dashboards/widgets/base-widget/base-widget.component';
import { SlaCalendarWidgetResponse, SlaConfig } from '../sla-widget.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { SlasService } from '../../pages/slas/Slas.service';
import { SlaCalendarWidgetService } from './sla-calendar-widget.service';

@Component({
    selector: 'oitc-sla-calendar-widget',
    imports: [],
    templateUrl: './sla-calendar-widget.component.html',
    styleUrl: './sla-calendar-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlaCalendarWidgetComponent extends BaseWidgetComponent implements OnDestroy, AfterViewInit {
    protected flipped = signal<boolean>(false);
    private readonly SlaCalendarWidgetService = inject(SlaCalendarWidgetService);
    private readonly SlasService = inject(SlasService);
    public slaId: number | null = null;
    public slaResponse?: SlaCalendarWidgetResponse;
    public config?: SlaConfig;
    protected slas: SelectKeyValue[] = [];

    constructor() {
        super();
        effect(() => {
            if (this.flipped()) {
                this.loadSlas();
            }
            this.cdr.markForCheck();
        });
    }

    public override load() {
        if (this.widget) {
            this.subscriptions.add(
                this.SlaCalendarWidgetService.loadWidgetConfig(this.widget.id).subscribe((response) => {
                    this.slaResponse = response;
                    this.config = response.config;
                    this.slaId = this.config.Sla.id;
                    this.cdr.markForCheck();
                })
            );
        }
    }

    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    public ngAfterViewInit(): void {
    }

    protected loadSlas = () => {
        this.subscriptions.add(this.SlasService.loadSlas().subscribe((result) => {
            this.slas = result;
            this.cdr.markForCheck();
        }));
    }

}
