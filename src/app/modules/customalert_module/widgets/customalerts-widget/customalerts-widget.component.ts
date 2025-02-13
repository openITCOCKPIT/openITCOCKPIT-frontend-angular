import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { WidgetGetForRender } from '../../../../pages/dashboards/dashboards.interface';
import { Subscription } from 'rxjs';
import { CustomAlertsService } from '../../pages/customalerts/customalerts.service';
import {
    CustomAlertsWidget,
    CustomAlertsWidgetFilter,
    getCustomAlertsWidgetParams
} from '../../pages/customalerts/customalerts.interface';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'oitc-customalerts-widget',
    imports: [],
    templateUrl: './customalerts-widget.component.html',
    styleUrl: './customalerts-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('flipState', [
            state('active', style({
                transform: 'rotateY(179deg)'
            })),
            state('inactive', style({
                transform: 'rotateY(0)'
            })),
            transition('active => inactive', animate('500ms ease-out')),
            transition('inactive => active', animate('500ms ease-in'))
        ])
    ]
})
export class CustomalertsWidgetComponent implements OnInit, OnDestroy {
    @Input() widget!: WidgetGetForRender;
    private subscriptions: Subscription = new Subscription();
    private readonly CustomAlertsService = inject(CustomAlertsService);
    public CustomalertsFilter: CustomAlertsWidgetFilter = getCustomAlertsWidgetParams();
    public statusCount: number = 0;
    public flip: string = 'inactive';

    public ngOnInit(): void {
        this.load();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


    private load() {
        this.subscriptions.add(
            this.CustomAlertsService.loadWidget(this.widget, this.CustomalertsFilter).subscribe((data: CustomAlertsWidget) => {
                this.CustomalertsFilter = data.config;
                this.statusCount = data.statusCount;
            })
        );
    }

    public toggleFlip() {
        this.flip = (this.flip == 'inactive') ? 'active' : 'inactive';
    }
}
