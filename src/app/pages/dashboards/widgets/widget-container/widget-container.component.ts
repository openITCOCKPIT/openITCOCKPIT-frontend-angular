import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { WidgetGetForRender } from '../../dashboards.interface';
import { WidgetTypes } from '../widgets.enum';
import {
    CustomalertsWidgetComponent
} from '../../../../modules/customalert_module/widgets/customalerts-widget/customalerts-widget.component';
import { OitcAlertComponent } from '../../../../components/alert/alert.component';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
    selector: 'oitc-widget-container',
    imports: [
        CustomalertsWidgetComponent,
        OitcAlertComponent,
        TranslocoPipe
    ],
    templateUrl: './widget-container.component.html',
    styleUrl: './widget-container.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetContainerComponent {

    widgetInput = input<WidgetGetForRender>();

    public widget?: WidgetGetForRender;

    protected readonly WidgetTypes = WidgetTypes;

    constructor() {
        effect(() => {
            this.widget = this.widgetInput();
        });
    }
}
