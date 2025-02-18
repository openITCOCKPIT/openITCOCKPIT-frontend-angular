import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';

@Component({
    selector: 'oitc-services-top-alerts-widget',
    imports: [],
    templateUrl: './services-top-alerts-widget.component.html',
    styleUrl: './services-top-alerts-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesTopAlertsWidgetComponent extends BaseWidgetComponent {

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
