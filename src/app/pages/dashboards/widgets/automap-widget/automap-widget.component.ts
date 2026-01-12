import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    signal,
    ViewChild
} from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { AnimationEvent } from '@angular/animations';
import {
    ColComponent,
    FormControlDirective,
    FormLabelDirective,
    RowComponent,
    TooltipDirective
} from '@coreui/angular';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AutomapWidgetConfig } from './automap-widget.interface';
import { AutomapWidgetService } from './automap-widget.service';
import { AutomapsService } from '../../../automaps/automaps.service';
import {
    AutomapsLoadAutomapsByStringParams,
    AutomapsViewParams,
    AutomapsViewRoot
} from '../../../automaps/automaps.interface';

import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { AutomapViewerComponent } from '../../../automaps/automaps-view/automap-viewer/automap-viewer.component';
import { PaginatorChangeEvent } from '../../../../layouts/coreui/paginator/paginator.interface';
import { SliderTimeComponent } from '../../../../components/slider-time/slider-time.component';

@Component({
    selector: 'oitc-automap-widget',
    imports: [
    FormLabelDirective,
    SelectComponent,
    RequiredIconComponent,
    XsButtonDirective,
    FaIconComponent,
    TranslocoDirective,
    FormControlDirective,
    FormsModule,
    AutomapViewerComponent,
    ColComponent,
    RowComponent,
    SliderTimeComponent,
    TranslocoPipe,
    TooltipDirective
],
    templateUrl: './automap-widget.component.html',
    styleUrl: './automap-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutomapWidgetComponent extends BaseWidgetComponent implements AfterViewInit {
    protected flipped = signal<boolean>(false);
    @ViewChild('boxContainer') boxContainer?: ElementRef;
    public widgetHeight: number = 0;

    // widget config will be loaded from the server
    public config?: AutomapWidgetConfig;

    public automaps: SelectKeyValue[] = [];
    private scrollIntervalId: any = null;
    public currentPage: number = 1;
    public useScroll: boolean = true;

    public result!: AutomapsViewRoot;

    private readonly AutomapWidgetService = inject(AutomapWidgetService);
    private readonly AutomapsService = inject(AutomapsService);

    public override load(): void {
        if (this.widget) {
            this.AutomapWidgetService.loadWidgetConfig(this.widget.id).subscribe((response) => {
                if (response.automap_id) {
                    // Cast any string to number
                    response.automap_id = Number(response.automap_id);
                }

                this.config = response;

                if (this.config.automap_id) {
                    this.loadAutomap();

                    if (this.config.useScroll) {
                        this.startScroll();
                    }
                }

                this.cdr.markForCheck();
            });
        }
    }

    public ngAfterViewInit(): void {
    }

    public override onAnimationStart(event: AnimationEvent) {
        if (event.toState && this.automaps.length === 0) {
            // "true" means show config.
            // Load initial Grafana Dashboards
            this.loadAutomaps('');
        }

        super.onAnimationStart(event);
    }

    public saveConfig(): void {
        if (this.config && this.widget) {
            this.AutomapWidgetService.saveWidgetConfig(this.widget.id, this.config).subscribe((response) => {
                // Update the markdown content
                this.load();

                // Close config
                this.flipped.set(false);
            });
        }
    }

    public loadAutomaps = (searchString: string): void => {
        const selected: number[] = [];
        if (this.config?.automap_id) {
            selected.push(Number(this.config.automap_id));
        }

        const params: AutomapsLoadAutomapsByStringParams = {
            angular: true,
            'filter[Automaps.name]': searchString,
            'selected[]': selected
        }

        this.subscriptions.add(this.AutomapsService.loadAutomapsByString(params)
            .subscribe((result) => {
                this.automaps = result;
                this.cdr.markForCheck();
            })
        );
    };

    public override ngOnDestroy(): void {
        this.stopScroll();
        super.ngOnDestroy();
    }

    public override resizeWidget(event?: KtdResizeEnd): void {

    }

    public override layoutUpdate(event: KtdGridLayout): void {

    }

    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.currentPage = change.page;
        this.useScroll = change.scroll;
        this.cdr.markForCheck();
        this.loadAutomap();
    }

    public loadAutomap(): void {
        if (this.config && this.config.automap_id) {

            const params: AutomapsViewParams = {
                angular: true,
                scroll: this.useScroll,
                page: this.currentPage,
                limit: this.config.limit
            };

            this.subscriptions.add(this.AutomapsService.view(Number(this.config.automap_id), params).subscribe(result => {
                this.result = result;
                this.cdr.markForCheck();
            }));
        }
    }

    public startScroll() {
        if (this.config) {
            this.config.useScroll = true;
        }

        // Clear any old interval
        if (this.scrollIntervalId) {
            clearInterval(this.scrollIntervalId);
            this.scrollIntervalId = null;
        }

        let interval = 5000;
        if (this.config?.scroll_interval) {
            interval = this.config?.scroll_interval;
        }

        // Scroll to next page and load data
        this.scrollIntervalId = setInterval(() => {
            if (this.result && this.result.scroll && this.result.scroll.hasNextPage) {
                this.currentPage++;
                this.loadAutomap();
            } else {
                this.currentPage = 1;
                this.loadAutomap();
            }
        }, interval);
    }

    public stopScroll() {
        if (this.config) {
            this.config.useScroll = false;
        }

        if (this.scrollIntervalId) {
            clearInterval(this.scrollIntervalId);
            this.scrollIntervalId = null;
        }
    }

    public onIntervalSliderChanged() {
        if (!this.config || this.isReadonly()) {
            return;
        }

        if (this.config.scroll_interval === 0) {
            this.stopScroll();
        } else {
            this.startScroll();
        }

        // Save the new interval
        this.saveConfig();
    }
}
