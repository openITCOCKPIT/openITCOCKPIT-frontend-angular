import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';

@Component({
    selector: 'oitc-welcome-widget',
    imports: [],
    templateUrl: './welcome-widget.component.html',
    styleUrl: './welcome-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WelcomeWidgetComponent extends BaseWidgetComponent {

    public override load() {
        super.load();
    }

    public override resizeWidget(event: KtdResizeEnd) {
        super.resizeWidget(event);
    }

    public override layoutUpdate(event: KtdGridLayout) {
        super.layoutUpdate(event);
    }


}
