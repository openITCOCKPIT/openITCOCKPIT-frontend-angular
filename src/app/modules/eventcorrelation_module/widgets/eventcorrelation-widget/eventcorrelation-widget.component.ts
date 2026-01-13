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
import {
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormLabelDirective,
    RowComponent
} from '@coreui/angular';

import { RequiredIconComponent } from '../../../../components/required-icon/required-icon.component';
import { SelectComponent } from '../../../../layouts/primeng/select/select/select.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { AnimationEvent } from '@angular/animations';
import { EventcorrelationWidgetService } from './eventcorrelation-widget.service';
import {
    EvcSummaryService,
    EvcTree,
    EventcorrelationRootElement
} from '../../pages/eventcorrelations/eventcorrelations.interface';
import { EvcTreeDirection } from '../../pages/eventcorrelations/eventcorrelations-view/evc-tree/evc-tree.enum';
import { EventcorrelationsService } from '../../pages/eventcorrelations/eventcorrelations.service';
import { EvcTreeComponent } from '../../pages/eventcorrelations/eventcorrelations-view/evc-tree/evc-tree.component';
import { EvcTableComponent } from '../../pages/eventcorrelations/eventcorrelations-view/evc-table/evc-table.component';
import { EventcorrelationWidgetConfig } from './eventcorrelation-widget.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconProp, RotateProp } from '@fortawesome/fontawesome-svg-core';


@Component({
    selector: 'oitc-eventcorrelation-widget',
    imports: [
    FaIconComponent,
    FormLabelDirective,
    RequiredIconComponent,
    SelectComponent,
    TranslocoDirective,
    XsButtonDirective,
    EvcTreeComponent,
    EvcTableComponent,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    ReactiveFormsModule,
    RowComponent,
    FormsModule
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
    public evcSummaryTree: EvcSummaryService[][] = [];
    public rootElement?: EventcorrelationRootElement;
    public hasWritePermission: boolean = false;


    public showInfoForDisabledService: number = 0;
    public disabledServices: number = 0; //number of disabled services in the EVC
    public stateForDisabledService: number = 3; // Unknown
    public animated: number = 0; // not animated
    public connectionLine: string = 'bezier'; // bezier, straight, segment

    public downtimedServices: number = 0; //number of services in a downtime in the EVC
    public stateForDowntimedService: number = 3; // Unknown

    // widget config will be loaded from the server
    public config!: EventcorrelationWidgetConfig;
    public direction: EvcTreeDirection = EvcTreeDirection.TOP_TO_BOTTOM;

    protected readonly EvcViewTypes: ({
        value: string;
        label: string;
        icon: IconProp
    })[] = [
        {
            value: 'tree',
            label: this.TranslocoService.translate('Tree'),
            icon: ['fas', 'sitemap']
        },
        {
            value: 'table',
            label: this.TranslocoService.translate('Table'),
            icon: ['fas', 'table-columns']
        }
    ];
    protected readonly EvcTreeDirections: ({
        key: string;
        label: string;
        rotate?: RotateProp
    })[] = [
        {
            key: 'RIGHT_TO_LEFT',
            label: this.TranslocoService.translate('right to left'),
            rotate: 90
        },
        {
            key: 'BOTTOM_TO_TOP',
            label: this.TranslocoService.translate('bottom to top'),
            rotate: 180
        },
        {
            key: 'LEFT_TO_RIGHT',
            label: this.TranslocoService.translate('left to right'),
            rotate: 270
        },
        {
            key: 'TOP_TO_BOTTOM',
            label: this.TranslocoService.translate('top to bottom')
        }
    ];

    public override load() {
        if (this.widget) {
            this.EventcorrelationWidgetService.loadWidgetConfig(this.widget.id).subscribe((response) => {
                this.host_id = response.host_id;
                this.config = response.config;
                this.direction= EvcTreeDirection[this.config.direction];

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
            this.show = true;
            this.cdr.markForCheck();
        } else {
            // "true" means show config.
            // The animation has stopped, and we are in the config view - so we can now remove the EVC from the DOM
            // We hide the EVC case if we flip back to the content, the EVC is messed up and needs to be re-rendered
            this.show = false;
            this.cdr.markForCheck();
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

    public resetHandler($event: EvcTreeDirection) {
        this.show = false;
        this.cdr.markForCheck();
        this.direction = $event;
        setTimeout(() =>{this.show = true; this.cdr.markForCheck();}, 100);
    }

    public saveConfig() {
        if (this.host_id && this.widget) {
            this.EventcorrelationWidgetService.saveWidgetConfig(this.widget.id, this.host_id, this.config).subscribe((response) => {
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
            this.evcSummaryTree = result.evcSummaryTree;
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
