import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';

@Component({
    selector: 'oitc-services-downtime-widget',
    imports: [],
    templateUrl: './services-downtime-widget.component.html',
    styleUrl: './services-downtime-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesDowntimeWidgetComponent extends BaseWidgetComponent {


    public override load() {
        super.load();
    }

    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    public override resizeWidget(event?: KtdResizeEnd) {
        super.resizeWidget(event);
    }

    public override layoutUpdate(event: KtdGridLayout) {
        super.layoutUpdate(event);
    }
}
