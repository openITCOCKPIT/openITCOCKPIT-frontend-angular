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
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormLabelDirective } from '@coreui/angular';
import { NgIf } from '@angular/common';
import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { AnimationEvent } from '@angular/animations';
import { EventcorrelationWidgetService } from './eventcorrelation-widget.service';
import { EvcTree, EventcorrelationRootElement } from '../../pages/eventcorrelations/eventcorrelations.interface';
import { EventcorrelationsService } from '../../pages/eventcorrelations/eventcorrelations.service';
import { EvcTreeComponent } from '../../pages/eventcorrelations/eventcorrelations-view/evc-tree/evc-tree.component';

@Component({
    selector: 'oitc-eventcorrelation-widget',
    imports: [
        FaIconComponent,
        FormLabelDirective,
        NgIf,
        RequiredIconComponent,
        SelectComponent,
        TranslocoDirective,
        XsButtonDirective,
        EvcTreeComponent
    ],
    templateUrl: './eventcorrelation-widget.component.html',
    styleUrl: './eventcorrelation-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventcorrelationWidgetComponent extends BaseWidgetComponent implements AfterViewInit {
    protected flipped = signal<boolean>(false);
    @ViewChild('boxContainer') boxContainer?: ElementRef;
    public widgetHeight: number = 0;

    public show: boolean = true;

    public host_id: null | number = null;

    public eventCorrelations: SelectKeyValue[] = [];

    private readonly EventcorrelationWidgetService = inject(EventcorrelationWidgetService);
    private readonly EventcorrelationsService = inject(EventcorrelationsService);

    // Variables for the EVC View
    public evcTree: EvcTree[] = [];
    public rootElement?: EventcorrelationRootElement;
    public hasWritePermission: boolean = false;

    public showInfoForDisabledService: number = 0;
    public disabledServices: number = 0; //number of disabled services in the EVC
    public stateForDisabledService: number = 3; // Unknown
    public animated: number = 0; // not animated
    public connectionLine: string = 'bezier'; // bezier, straight, segment

    public downtimedServices: number = 0; //number of services in a downtime in the EVC
    public stateForDowntimedService: number = 3; // Unknown

    public override load() {
        if (this.widget) {
            this.EventcorrelationWidgetService.loadWidgetConfig(this.widget.id).subscribe((response) => {
                this.host_id = response.host_id;

                if (this.host_id) {
                    this.loadEventcorrelation();
                }

                this.cdr.markForCheck();
            });
        }
    }

    public ngAfterViewInit(): void {
        this.calcEvcHeight();
    }

    public override onAnimationStart(event: AnimationEvent) {
        if (event.toState && this.eventCorrelations.length === 0) {
            // "true" means show config.
            // Load initial Grafana Dashboards
            this.loadEventCorrelations('');
        }

        super.onAnimationStart(event);
    }


    public override onAnimationDone(event: AnimationEvent) {
        super.onAnimationDone(event);

        if (!event.toState) {
            // "false" means show content.

            // We have to remove the EVC from the DOM and re-add
            // otherwise the lines are not drawn correctly
            this.show = false;
            this.cdr.markForCheck();
            setTimeout(() => {
                this.show = true;
                this.cdr.markForCheck();
            }, 10);
        }
    }

    private calcEvcHeight() {
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
        if (this.host_id && this.widget) {
            this.EventcorrelationWidgetService.saveWidgetConfig(this.widget.id, this.host_id).subscribe((response) => {
                // Update the markdown content
                this.load();

                // Close config
                this.flipped.set(false);
            });
        }
    }

    public loadEventCorrelations = (searchString: string) => {
        this.subscriptions.add(this.EventcorrelationWidgetService.loadEventCorrelations(searchString)
            .subscribe((result) => {
                this.eventCorrelations = result;

                this.cdr.markForCheck();
            })
        );
    };

    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    public override resizeWidget(event?: KtdResizeEnd) {
        this.calcEvcHeight();
    }

    public override layoutUpdate(event: KtdGridLayout) {

    }


    public loadEventcorrelation() {
        if (!this.host_id) {
            return;
        }

        this.subscriptions.add(this.EventcorrelationsService.getEventcorrelationView(this.host_id).subscribe((result) => {
            this.cdr.markForCheck();

            this.evcTree = result.evcTree;
            this.rootElement = result.rootElement;
            this.hasWritePermission = result.hasWritePermission;
            this.showInfoForDisabledService = result.showInfoForDisabledService;
            this.stateForDisabledService = result.stateForDisabledService;
            this.disabledServices = result.disabledServices;
            this.animated = result.animated;
            this.connectionLine = result.connectionLine;

            this.downtimedServices = result.downtimedServices;
            this.stateForDowntimedService = result.stateForDowntimedService;

        }));
    }
}
