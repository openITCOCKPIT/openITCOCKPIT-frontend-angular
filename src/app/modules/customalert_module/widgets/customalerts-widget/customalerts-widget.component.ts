import { ChangeDetectionStrategy, Component, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { WidgetGetForRender } from '../../../../pages/dashboards/dashboards.interface';
import { Subscription } from 'rxjs';
import { CustomAlertsService } from '../../pages/customalerts/customalerts.service';
import {
    CustomAlertsWidget,
    CustomAlertsWidgetFilter,
    getCustomAlertsWidgetParams
} from '../../pages/customalerts/customalerts.interface';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass, NgIf } from '@angular/common';
import { ColComponent, RowComponent } from '@coreui/angular';
import { WidgetTypes } from '../../../../pages/dashboards/widgets/widgets.enum';

@Component({
    selector: 'oitc-customalerts-widget',
    imports: [
        FaIconComponent,
        NgIf,
        NgClass,
        RowComponent,
        ColComponent
    ],
    templateUrl: './customalerts-widget.component.html',
    styleUrl: './customalerts-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('flip', [
            state('false', style({transform: 'none'})),
            state('true', style({transform: 'rotateY(180deg)'})),
            transition('false <=> true', animate('0.8s ease-in-out'))
        ])
    ]
})
export class CustomalertsWidgetComponent implements OnInit, OnDestroy {
    @Input() widget!: WidgetGetForRender;
    private subscriptions: Subscription = new Subscription();
    private readonly CustomAlertsService = inject(CustomAlertsService);
    public CustomalertsFilter: CustomAlertsWidgetFilter = getCustomAlertsWidgetParams();
    public statusCount: number | null = null;
    public readOnly: boolean = true;
    protected flipped = signal(false);

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
                //this.readOnly = this.widget.is;
            })
        );
    }

    protected readonly WidgetTypes = WidgetTypes;
}
