import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WidgetGetForRender } from '../../dashboards.interface';
import { WidgetsService } from '../widgets.service';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { TranslocoService } from '@jsverse/transloco';
import { PermissionsService } from '../../../../permissions/permissions.service';

@Component({
    selector: 'oitc-base-widget',
    imports: [],
    templateUrl: './base-widget.component.html',
    styleUrl: './base-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export abstract class BaseWidgetComponent implements OnDestroy {

    public widgetInput = input<WidgetGetForRender>();
    public widget?: WidgetGetForRender;
    public isReadonly = input<boolean>(false);

    protected readonly subscriptions = new Subscription();
    protected readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected readonly WidgetsService = inject(WidgetsService);
    public readonly PermissionsService = inject(PermissionsService);
    protected readonly TranslocoService = inject(TranslocoService);


    public constructor() {
        effect(() => {
            this.widget = this.widgetInput();
            this.load();
        });

        this.subscriptions.add(this.WidgetsService.onResizeEnded$.subscribe(event => {
            if (this.widget) {
                if (event.layoutItem.id === this.widget.id) {
                    this.resizeWidget(event);
                }
            }
        }));

        this.subscriptions.add(this.WidgetsService.onLayoutUpdated$.subscribe(event => {
            if (this.widget) {
                this.layoutUpdate(event);
            }
        }));

    }

    public load() {
        console.log('Implement load() method in your widget component');
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public resizeWidget(event?: KtdResizeEnd) {
        console.log('Implement resizeWidget(event: KtdResizeEnd) method in your widget component');
    }

    public layoutUpdate(event: KtdGridLayout) {
        console.log('Implement layoutUpdate(event: KtdGridLayout) method in your widget component');
    }
}
