import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    signal,
    ViewChild
} from '@angular/core';
import { BaseWidgetComponent } from '../../../../pages/dashboards/widgets/base-widget/base-widget.component';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { AnimationEvent } from '@angular/animations';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormLabelDirective } from '@coreui/angular';
import { IframeComponent } from '../../../../components/iframe/iframe.component';
import { NgIf } from '@angular/common';
import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { MapWidgetService } from './map-widget.service';
import { MapWidgetConfig } from './map-widget.interface';
import { MapsByStringParams } from '../../pages/mapeditors/mapeditors.interface';

@Component({
    selector: 'oitc-map-widget',
    imports: [
        FaIconComponent,
        FormLabelDirective,
        IframeComponent,
        NgIf,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective
    ],
    templateUrl: './map-widget.component.html',
    styleUrl: './map-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapWidgetComponent extends BaseWidgetComponent implements AfterViewInit {

    protected flipped = signal<boolean>(false);
    @ViewChild('boxContainer') boxContainer?: ElementRef;
    public widgetHeight: number = 0;

    public config?: MapWidgetConfig;

    public maps: SelectKeyValue[] = [];

    private readonly MapWidgetService = inject(MapWidgetService);

    public override load() {
        if (this.widget) {
            this.MapWidgetService.loadWidgetConfig(this.widget.id).subscribe((response) => {
                this.config = response;
                this.cdr.markForCheck();
            });
        }
    }

    public ngAfterViewInit(): void {
        this.calcIframeHeight();
    }

    public override onAnimationStart(event: AnimationEvent) {
        if (event.toState && this.maps.length === 0) {
            // "true" means show config.
            // Load initial Grafana Dashboards
            this.loadMaps('');
        }

        super.onAnimationStart(event);
    }

    private calcIframeHeight() {
        this.widgetHeight = this.boxContainer?.nativeElement.offsetHeight;

        let height = this.widgetHeight - 29 - 12; //Unit: px
        //                                        ^ Show / Hide Config button
        //                                            ^ Some Padding

        if (height < 15) {
            height = 15;
        }

        this.widgetHeight = height;
        this.cdr.markForCheck();
    }

    public saveConfig() {
        if (this.config && this.widget) {
            this.MapWidgetService.saveWidgetConfig(this.widget.id, this.config).subscribe((response) => {
                this.load();

                // Close config
                this.flipped.set(false);
            });
        }
    }

    public loadMaps = (searchString: string) => {

        const selected: number[] = [];
        if (this.config?.map_id) {
            selected.push(this.config.map_id);
        }

        const params: MapsByStringParams = {
            angular: true,
            'filter[Maps.name]': searchString,
            'selected[]': selected
        };

        this.subscriptions.add(this.MapWidgetService.loadMapsByString(params)
            .subscribe((result) => {
                this.maps = result;
                this.cdr.markForCheck();
            })
        );
    };

    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    public override resizeWidget(event?: KtdResizeEnd) {
        this.calcIframeHeight();
    }

    public override layoutUpdate(event: KtdGridLayout) {

    }

}
