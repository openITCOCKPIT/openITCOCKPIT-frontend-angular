import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import {
    BgColorDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    ColComponent,
    RowComponent
} from '@coreui/angular';

import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { TodayWidgetResponse } from '../widgets.interface';

@Component({
    selector: 'oitc-today-widget',
    imports: [
        BgColorDirective,
        CardBodyComponent,
        CardComponent,
        CardFooterComponent,
        CardHeaderComponent,
        ColComponent,
        RowComponent
    ],
    templateUrl: './today-widget.component.html',
    styleUrl: './today-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodayWidgetComponent extends BaseWidgetComponent implements AfterViewInit {

    @ViewChild('calendarContainer') calendarContainer?: ElementRef;
    public response?: TodayWidgetResponse;
    public widgetHeight: number = 0;
    public fontSize: number = 0;

    public override load() {
        if (this.widget) {
            this.subscriptions.add(this.WidgetsService.loadTodayWidget(this.widget)
                .subscribe((result) => {
                    this.response = result;
                    this.cdr.markForCheck();
                }));
        }
    }

    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    public ngAfterViewInit(): void {
        this.resizeWidget();
    }

    public override resizeWidget(event?: KtdResizeEnd) {
        this.widgetHeight = this.calendarContainer?.nativeElement.offsetHeight;
        this.fontSize = this.widgetHeight / 3.5;
        this.cdr.markForCheck();
    }

    public override layoutUpdate(event: KtdGridLayout) {
    }


}
