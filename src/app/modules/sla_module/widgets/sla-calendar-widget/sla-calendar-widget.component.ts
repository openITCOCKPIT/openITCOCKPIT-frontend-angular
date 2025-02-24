import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    OnDestroy,
    signal,
    ViewChild
} from '@angular/core';
import { BaseWidgetComponent } from '../../../../pages/dashboards/widgets/base-widget/base-widget.component';
import { SlaCalendarWidgetResponse, SlaConfig } from '../sla-widget.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { SlasService } from '../../pages/slas/Slas.service';
import { SlaCalendarWidgetService } from './sla-calendar-widget.service';
import {
    AlertComponent,
    AlertHeadingDirective,
    BadgeComponent,
    BgColorDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    ColComponent,
    FormLabelDirective,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { AsyncPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { CalendarDateDetails } from '../../../../pages/dashboards/widgets/calendar-widget/calendar-widget.interface';
import { KtdResizeEnd } from '@katoid/angular-grid-layout';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { LabelLinkComponent } from '../../../../layouts/coreui/label-link/label-link.component';

@Component({
    selector: 'oitc-sla-calendar-widget',
    imports: [
        BadgeComponent,
        BgColorDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        ColComponent,
        NgForOf,
        NgIf,
        RowComponent,
        TableDirective,
        NgClass,
        FaIconComponent,
        TranslocoDirective,
        AsyncPipe,
        AlertComponent,
        AlertHeadingDirective,
        FormLabelDirective,
        SelectComponent,
        TranslocoPipe,
        XsButtonDirective,
        LabelLinkComponent
    ],
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
    public dateDetails?: CalendarDateDetails;
    public widgetHeight: number = 0;
    public fontSize: number = 0;
    @ViewChild('slaCalendarContainer') slaCalendarContainer?: ElementRef;
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
                    this.dateDetails = this.slaResponse.dateDetails;
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

    public override resizeWidget(event?: KtdResizeEnd) {
        this.widgetHeight = this.slaCalendarContainer?.nativeElement.offsetHeight;
        this.fontSize = this.widgetHeight / 4;
        this.cdr.markForCheck();
    }

    public ngAfterViewInit(): void {
        this.resizeWidget();
    }

    protected loadSlas = () => {
        this.subscriptions.add(this.SlasService.loadSlas().subscribe((result) => {
            this.slas = result;
            this.cdr.markForCheck();
        }));
    }

    public saveWidgetConfig(): void {
        if (!this.widget || !this.slaId) {
            return;
        }
        this.subscriptions.add(this.SlaCalendarWidgetService.saveWidgetConfig(this.widget.id, this.slaId).subscribe((response) => {
            // Close config
            this.flipped.set(false);

            // Reload sla widget
            this.load();
        }));
    }

    protected readonly Object = Object;
}
