import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core';
import { WidgetGetForRender } from '../../dashboards.interface';
import { WidgetTypes } from '../widgets.enum';
import {
    CustomalertsWidgetComponent
} from '../../../../modules/customalert_module/widgets/customalerts-widget/customalerts-widget.component';
import { OitcAlertComponent } from '../../../../components/alert/alert.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { WelcomeWidgetComponent } from '../welcome-widget/welcome-widget.component';
import { ParentOutagesWidgetComponent } from '../parent-outages-widget/parent-outages-widget.component';
import { HostsPiechartWidgetComponent } from '../hosts-piechart-widget/hosts-piechart-widget.component';
import { HostsPiechartWidget180Component } from '../hosts-piechart-widget180/hosts-piechart-widget180.component';
import { ServicesPiechartWidgetComponent } from '../services-piechart-widget/services-piechart-widget.component';
import {
    ServicesPiechartWidget180Component
} from '../services-piechart-widget180/services-piechart-widget180.component';
import { HostsDowntimeWidgetComponent } from '../hosts-downtime-widget/hosts-downtime-widget.component';

@Component({
    selector: 'oitc-widget-container',
    imports: [
        CustomalertsWidgetComponent,
        OitcAlertComponent,
        TranslocoPipe,
        WelcomeWidgetComponent,
        ParentOutagesWidgetComponent,
        HostsPiechartWidgetComponent,
        HostsPiechartWidget180Component,
        ServicesPiechartWidgetComponent,
        ServicesPiechartWidget180Component,
        HostsDowntimeWidgetComponent
    ],
    templateUrl: './widget-container.component.html',
    styleUrl: './widget-container.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetContainerComponent {

    widgetInput = input<WidgetGetForRender>();
    isReadonly = input<boolean>(false);

    public widget?: WidgetGetForRender;

    protected readonly WidgetTypes = WidgetTypes;

    constructor() {
        effect(() => {
            this.widget = this.widgetInput();
        });
    }
}
