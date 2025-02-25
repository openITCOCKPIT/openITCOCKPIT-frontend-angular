import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseWidgetComponent } from '../../../../pages/dashboards/widgets/base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';

@Component({
    selector: 'oitc-eventcorrelation-widget',
    imports: [],
    templateUrl: './eventcorrelation-widget.component.html',
    styleUrl: './eventcorrelation-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventcorrelationWidgetComponent extends BaseWidgetComponent implements AfterViewInit {

    public override load() {

    }

    public ngAfterViewInit(): void {
    }

    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    public override resizeWidget(event?: KtdResizeEnd) {

    }

    public override layoutUpdate(event: KtdGridLayout) {

    }
}
