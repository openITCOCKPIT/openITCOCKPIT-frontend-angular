import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { SummaryStateServices } from '../../../hosts/summary_state.interface';
import { HostgroupsLoadHostgroupsByStringParams } from '../../../hostgroups/hostgroups.interface';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TacticalOverviewServicesWidgetService } from './tactical-overview-services-widget.service';
import { GenericValidationError } from '../../../../generic-responses';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { ServicegroupsService } from '../../../servicegroups/servicegroups.service';
import { TacticalOverviewServicesConfig } from './tactical-overview-services-widget.interface';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { AsyncPipe, NgIf } from '@angular/common';
import { FaIconComponent, FaStackComponent, FaStackItemSizeDirective } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import {
    ButtonDirective,
    ColComponent,
    FormCheckInputDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent
} from '@coreui/angular';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import {
    RegexHelperTooltipComponent
} from '../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { MultiSelectComponent } from '../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { HostgroupsService } from '../../../hostgroups/hostgroups.service';

@Component({
    selector: 'oitc-tactical-overview-services-widget',
    imports: [
        ReactiveFormsModule,
        FormsModule,
        TranslocoDirective,
        NgIf,
        FaIconComponent,
        AsyncPipe,
        RouterLink,
        TranslocoPipe,
        RowComponent,
        ColComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        FormControlDirective,
        DebounceDirective,
        FormCheckInputDirective,
        RegexHelperTooltipComponent,
        NgSelectComponent,
        MultiSelectComponent,
        ButtonDirective,
        FaStackComponent,
        FaStackItemSizeDirective,
        XsButtonDirective

    ],
    templateUrl: './tactical-overview-services-widget.component.html',
    styleUrl: './tactical-overview-services-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TacticalOverviewServicesWidgetComponent extends BaseWidgetComponent {
    protected flipped = signal<boolean>(false);
    public readonly HostgroupsService: HostgroupsService = inject(HostgroupsService);
    public readonly ServicegroupsService: ServicegroupsService = inject(ServicegroupsService);
    public servicestatusSummary?: SummaryStateServices;
    public servicestatusCountPercentage: number[] = [];
    public config?: TacticalOverviewServicesConfig;
    protected hostgroups: SelectKeyValue[] = [];
    protected servicegroups: SelectKeyValue[] = [];
    public keywords: string[] = [];
    public notKeywords: string[] = [];
    public servicegroupKeywords: string[] = [];
    public servicegroupNotKeywords: string[] = [];
    public hostgroupKeywords: string[] = [];
    public hostgroupNotKeywords: string[] = [];
    private readonly TacticalOverviewServicesWidgetService = inject(TacticalOverviewServicesWidgetService);
    private readonly notyService = inject(NotyService);

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
            this.subscriptions.add(this.TacticalOverviewServicesWidgetService.getTacticalOverviewWidget(this.widget, 'services')
                .subscribe((result) => {
                    this.config = result.config;
                    this.keywords = this.config.Service.keywords.split(',').filter(Boolean);
                    this.notKeywords = this.config.Service.not_keywords.split(',').filter(Boolean);
                    this.hostgroupKeywords = this.config.Hostgroup.keywords.split(',').filter(Boolean);
                    this.hostgroupNotKeywords = this.config.Hostgroup.not_keywords.split(',').filter(Boolean);
                    this.servicegroupKeywords = this.config.Servicegroup.keywords.split(',').filter(Boolean);
                    this.servicegroupNotKeywords = this.config.Servicegroup.not_keywords.split(',').filter(Boolean);
                    this.servicestatusSummary = result.servicestatusSummary;
                    this.servicestatusCountPercentage = result.servicestatusCountPercentage;
                    this.cdr.markForCheck();
                }));
        }
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

    public onFilterChange($event: any) {
        this.cdr.markForCheck();
        this.load();
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

        this.subscriptions.add(this.TacticalOverviewServicesWidgetService.saveWidget(this.widget, this.config)
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
}
