import {
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent
} from '@coreui/angular';
import { BaseWidgetComponent } from '../../../../pages/dashboards/widgets/base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';

import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { AnimationEvent } from '@angular/animations';
import { EventcorrelationsSummaryWidgetService } from './eventcorrelations-summary-widget.service';

import { EvcTreeDirection } from '../../pages/eventcorrelations/eventcorrelations-view/evc-tree/evc-tree.enum';
import { EventcorrelationsSummaryWidgetConfig } from './eventcorrelations-summary-widget.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    signal,
    ViewChild
} from '@angular/core';
import { GenericValidationError } from '../../../../generic-responses';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MultiSelectComponent } from '../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import {
    RegexHelperTooltipComponent
} from '../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { HostgroupsLoadHostgroupsByStringParams } from '../../../../pages/hostgroups/hostgroups.interface';
import { HostgroupsService } from '../../../../pages/hostgroups/hostgroups.service';
import { ServicegroupsService } from '../../../../pages/servicegroups/servicegroups.service';


@Component({
    selector: 'oitc-evencorrelations-summary-widget',
    imports: [
        FaIconComponent,
        TranslocoDirective,
        XsButtonDirective,
        ColComponent,
        ReactiveFormsModule,
        RowComponent,
        FormsModule,
        FormCheckComponent,
        FormCheckLabelDirective,
        NgSelectComponent,
        TranslocoPipe,
        InputGroupComponent,
        InputGroupTextDirective,
        FaStackComponent,
        MultiSelectComponent,
        FaStackItemSizeDirective,
        FormControlDirective,
        FormCheckInputDirective,
        RegexHelperTooltipComponent
    ],
    templateUrl: './eventcorrelations-summary-widget.component.html',
    styleUrl: './eventcorrelations-summary-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventcorrelationsSummaryWidgetComponent extends BaseWidgetComponent implements AfterViewInit {

    protected flipped = signal<boolean>(false);
    @ViewChild('boxContainer') boxContainer?: ElementRef;
    public widgetHeight: number = 0;

    public show: boolean = true;


    private readonly EventcorrelationsSummaryWidgetService = inject(EventcorrelationsSummaryWidgetService);

    public readonly HostgroupsService: HostgroupsService = inject(HostgroupsService);
    public readonly ServicegroupsService: ServicegroupsService = inject(ServicegroupsService);
    // widget config will be loaded from the server
    public config!: EventcorrelationsSummaryWidgetConfig;
    protected hostgroups: SelectKeyValue[] = [];
    protected servicegroups: SelectKeyValue[] = [];
    public keywords: string[] = [];
    public notKeywords: string[] = [];
    public servicegroupKeywords: string[] = [];
    public servicegroupNotKeywords: string[] = [];
    public hostgroupKeywords: string[] = [];
    public hostgroupNotKeywords: string[] = [];
    private readonly notyService = inject(NotyService);
    public priorityFilter: { 1: boolean; 2: boolean; 3: boolean; 4: boolean; 5: boolean } = {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false
    };

    constructor() {
        super();
        effect(() => {
            if (this.flipped()) {
                this.loadHostgroups('');
                this.loadServicegroups('');
            }
            this.cdr.markForCheck();
        });
    }

    public override load() {
        if (this.widget) {
            this.EventcorrelationsSummaryWidgetService.loadWidgetConfig(this.widget.id).subscribe((response: any) => {
                this.config = response.config;

                // if (this.host_id) {
                //     this.loadEventcorrelation();
                // }

                this.cdr.markForCheck();
            });
        }
    }

    public ngAfterViewInit(): void {
        //this.calcEvcHeight();
    }

    protected loadHostgroups = (search: string) => {
        let hostgroupIds: number[] = [];
        if (this.config?.Hostgroup._ids) {
            hostgroupIds = this.config.Hostgroup._ids;
        }
        this.subscriptions.add(this.HostgroupsService.loadHostgroupsByString({
            'filter[Containers.name]': search,
            'selected[]': hostgroupIds
        } as HostgroupsLoadHostgroupsByStringParams).subscribe((data: SelectKeyValue[]) => {
            this.hostgroups = data;
            this.cdr.markForCheck();
        }));
    }

    protected loadServicegroups = (search: string) => {
        let servicegroupIds: number[] = [];
        if (this.config?.Servicegroup._ids) {
            servicegroupIds = this.config.Servicegroup._ids;
        }
        this.subscriptions.add(this.ServicegroupsService.loadServicegroupsByString({
            'filter[Containers.name]': search,
            'selected[]': servicegroupIds
        } as HostgroupsLoadHostgroupsByStringParams).subscribe((data: SelectKeyValue[]) => {
            this.servicegroups = data;
            this.cdr.markForCheck();
        }));
    }


    public override onAnimationStart(event: AnimationEvent) {


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
        setTimeout(() => {
            this.show = true;
            this.cdr.markForCheck();
        }, 100);
    }

    public saveConfig() {
        if (this.widget) {


            // Close config
            this.flipped.set(false);
        }
    }

    public submit() {
        if (!this.widget || !this.config) {
            return;
        }

        this.config.Service.keywords = this.keywords.join(',');
        this.config.Service.not_keywords = this.notKeywords.join(',');
        this.config.Hostgroup.keywords = this.hostgroupKeywords.join(',');
        this.config.Hostgroup.not_keywords = this.hostgroupNotKeywords.join(',');
        this.config.Servicegroup.keywords = this.servicegroupKeywords.join(',');
        this.config.Servicegroup.not_keywords = this.servicegroupNotKeywords.join(',');

        let priorityFilter: number[] = [];
        for (let key in this.priorityFilter) {
            // @ts-ignore
            if (this.priorityFilter[key] === true) {
                priorityFilter.push(Number(key));
            }
        }

        this.config.servicepriority = priorityFilter;

        this.subscriptions.add(this.EventcorrelationsSummaryWidgetService.saveWidgetConfig(this.widget.id, this.config)
            .subscribe({
                next: (result) => {
                    this.cdr.markForCheck();
                    const title = this.TranslocoService.translate('Success');
                    const msg = this.TranslocoService.translate('Data saved successfully');

                    this.notyService.genericSuccess(msg, title);
                    this.notyService.scrollContentDivToTop();
                    this.load();
                    this.flipped.set(false);

                    return;
                },
                // Error
                error: (error) => {
                    const errorResponse = error as GenericValidationError;
                    this.notyService.genericError();
                }
            }));

    }

    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    public override resizeWidget(event?: KtdResizeEnd) {
        this.calcEvcHeight();
    }

    public override layoutUpdate(event: KtdGridLayout) {

    }
}
