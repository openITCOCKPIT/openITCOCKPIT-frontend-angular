import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { DashboardsService } from '../../dashboards.service';
import { CalendarDateDetails } from '../../dashboards.interface';
import {
    BadgeComponent,
    BgColorDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    ColComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { KtdResizeEnd } from '@katoid/angular-grid-layout';

@Component({
    selector: 'oitc-calendar-widget',
    imports: [
        RowComponent,
        ColComponent,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        BgColorDirective,
        NgIf,
        CardFooterComponent,
        TableDirective,
        NgForOf,
        BadgeComponent,
        NgClass
    ],
    templateUrl: './calendar-widget.component.html',
    styleUrl: './calendar-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarWidgetComponent extends BaseWidgetComponent implements AfterViewInit {
    public readonly DashboardsService: DashboardsService = inject(DashboardsService);
    public dateDetails?: CalendarDateDetails;
    public widgetHeight: number = 0;
    public fontSize: number = 0;
    @ViewChild('calendarContainer') calendarContainer?: ElementRef;


    public override load() {
        if (this.widget) {
            this.subscriptions.add(this.DashboardsService.getCalendarWidget(this.widget)
                .subscribe((result) => {
                    this.dateDetails = result.dateDetails;
                    this.cdr.markForCheck();
                }));
        }
    }

    public override resizeWidget(event?: KtdResizeEnd) {
        this.widgetHeight = this.calendarContainer?.nativeElement.offsetHeight;
        this.fontSize = this.widgetHeight / 3.5;
        this.cdr.markForCheck();
    }

    public ngAfterViewInit(): void {
        this.resizeWidget();
    }

    protected readonly Object = Object;
}
