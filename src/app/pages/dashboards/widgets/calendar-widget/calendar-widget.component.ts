import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';

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
import { NgClass } from '@angular/common';
import { KtdResizeEnd } from '@katoid/angular-grid-layout';
import { CalendarWidgetService } from './calendar-widget.service';
import { CalendarDateDetails } from './calendar-widget.interface';

@Component({
    selector: 'oitc-calendar-widget',
    imports: [
        RowComponent,
        ColComponent,
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        BgColorDirective,
        CardFooterComponent,
        TableDirective,
        BadgeComponent,
        NgClass
    ],
    templateUrl: './calendar-widget.component.html',
    styleUrl: './calendar-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarWidgetComponent extends BaseWidgetComponent implements AfterViewInit {
    public dateDetails?: CalendarDateDetails;
    public widgetHeight: number = 0;
    public fontSize: number = 0;
    @ViewChild('calendarContainer') calendarContainer?: ElementRef;
    private readonly CalendarWidgetService = inject(CalendarWidgetService);


    public override load() {
        if (this.widget) {
            this.subscriptions.add(this.CalendarWidgetService.getCalendarWidget(this.widget)
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
