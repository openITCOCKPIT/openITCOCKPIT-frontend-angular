import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    effect,
    ElementRef,
    inject,
    OnDestroy,
    signal,
    ViewChild
} from '@angular/core';

import { ServiceStatusOverviewExtendedWidgetConfig } from './service-status-overview-extended-widget.interface';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { ServiceStatusOverviewExtendedWidgetService } from './service-status-overview-extended-widget.service';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AsyncPipe, NgClass } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { GenericValidationError } from '../../../../generic-responses';
import {
    ColComponent,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent
} from '@coreui/angular';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TrueFalseDirective } from '../../../../directives/true-false.directive';
import { SelectKeyValue } from '../../../../layouts/primeng/select.interface';
import { ServicegroupsLoadServicegroupsByStringParams } from '../../../servicegroups/servicegroups.interface';
import { ServicegroupsService } from '../../../servicegroups/servicegroups.service';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import { MultiSelectComponent } from '../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import {
    RegexHelperTooltipComponent
} from '../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';
import { ContainersService } from '../../../containers/containers.service';
import { ContainersLoadContainersByStringParams } from '../../../containers/containers.interface';

@Component({
    selector: 'oitc-service-status-overview-extended-widget',
    imports: [
        FaIconComponent,
        TranslocoDirective,
        RowComponent,
        NgClass,
        AsyncPipe,
        ColComponent,
        RouterLink,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormsModule,
        TranslocoPipe,
        XsButtonDirective,
        TrueFalseDirective,
        InputGroupTextDirective,
        InputGroupComponent,
        DebounceDirective,
        MultiSelectComponent,
        NgSelectComponent,
        RegexHelperTooltipComponent,
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective
    ],
    templateUrl: './service-status-overview-extended-widget.component.html',
    styleUrl: './service-status-overview-extended-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceStatusOverviewExtendedWidget extends BaseWidgetComponent implements OnDestroy, AfterViewInit {
    protected flipped = signal<boolean>(false);
    public readonly ContainersService: ContainersService = inject(ContainersService);
    public readonly ServicegroupsService: ServicegroupsService = inject(ServicegroupsService);

    public config?: ServiceStatusOverviewExtendedWidgetConfig;
    private readonly ServiceStatusOverviewExtendedWidgetService = inject(ServiceStatusOverviewExtendedWidgetService);
    public statusCount: number | null = null;
    public serviceIds: number[] = [];
    public widgetHeight: number = 0;
    public widgetWidth: number = 0;
    public fontSize: number = 0;
    public fontSizeIcon: number = 0;
    public iconTopPosition: number = 0;
    public containers: SelectKeyValue[] = [];
    protected containerIds: number[] = [];
    protected servicegroups: SelectKeyValue[] = [];
    protected servicegroupsIds: number[] = [];

    public keywordsHost: string[] = [];
    public keywords: string[] = [];
    public notKeywordsHost: string[] = [];
    public notKeywords: string[] = [];
    private readonly notyService = inject(NotyService);
    public errors: GenericValidationError | null = null;

    @ViewChild('boxContainer') boxContainer?: ElementRef;

    constructor() {
        super();
        effect(() => {
            if (this.flipped()) {
                this.loadContainers('');
                this.loadServicegroups('');
            }
            this.cdr.markForCheck();
        });
    }


    public override load() {
        if (this.widget) {
            this.subscriptions.add(this.ServiceStatusOverviewExtendedWidgetService.getServiceStatusOverviewExtendedWidget(this.widget)
                .subscribe((result) => {
                    this.config = result.config;
                    this.statusCount = parseInt(result.statusCount, 10);
                    this.keywordsHost = this.config.Host.keywords.split(',').filter(Boolean);
                    this.keywords = this.config.Service.keywords.split(',').filter(Boolean);
                    this.notKeywordsHost = this.config.Host.not_keywords.split(',').filter(Boolean);
                    this.notKeywords = this.config.Service.not_keywords.split(',').filter(Boolean);
                    this.containerIds = this.config.Container._ids.split(',').map(Number).filter(Boolean);
                    this.servicegroupsIds = this.config.Servicegroup._ids.split(',').map(Number).filter(Boolean);
                    this.serviceIds = result.serviceIds;
                    this.cdr.markForCheck();
                }));
        }
    }


    public override ngOnDestroy() {
        super.ngOnDestroy();
    }

    public override resizeWidget(event?: KtdResizeEnd) {
        let editButtonHeight = 30;
        if (this.isReadonly()) {
            //edit button is not visible
            editButtonHeight = 0;
        }
        this.widgetHeight = this.boxContainer?.nativeElement.offsetHeight - editButtonHeight; //21px height of button + padding
        this.widgetWidth = this.boxContainer?.nativeElement.offsetWidth;
        const scaleValue = Math.min(this.widgetHeight, this.widgetWidth);

        this.fontSize = scaleValue / 3;
        this.fontSizeIcon = scaleValue / 4;
        this.iconTopPosition = this.widgetHeight - this.fontSizeIcon - editButtonHeight;
        this.cdr.markForCheck();
    }

    public ngAfterViewInit(): void {
        this.resizeWidget();
    }

    public override layoutUpdate(event: KtdGridLayout) {
    }

    public loadContainers = (searchString: string) => {
        let params: ContainersLoadContainersByStringParams = {
            angular: true,
            'filter[Containers.name]': searchString
        }

        this.subscriptions.add(this.ContainersService.loadContainersByString(params)
            .subscribe((result) => {
                this.containers = result;
                this.cdr.markForCheck();
            })
        );
    }

    protected loadServicegroups = (search: string) => {
        let servicegroupIds: number[] = [];
        if (this.config?.Servicegroup._ids) {
            servicegroupIds = this.config.Servicegroup._ids.split(',').map(Number);
        }
        this.subscriptions.add(this.ServicegroupsService.loadServicegroupsByString({
            'filter[Containers.name]': search,
            'selected[]': servicegroupIds
        } as ServicegroupsLoadServicegroupsByStringParams).subscribe((data: SelectKeyValue[]) => {
            this.servicegroups = data;
            this.cdr.markForCheck();
        }));
    }

    public submit() {
        if (!this.widget || !this.config) {
            return;
        }

        this.config.Host.keywords = this.keywordsHost.join(',');
        this.config.Host.not_keywords = this.notKeywordsHost.join(',');
        this.config.Service.keywords = this.keywords.join(',');
        this.config.Service.not_keywords = this.notKeywords.join(',');
        this.config.Container._ids = this.containerIds.join(',');
        this.config.Servicegroup._ids = this.servicegroupsIds.join(',');

        this.subscriptions.add(this.ServiceStatusOverviewExtendedWidgetService.saveWidgetConfig(this.widget.id, this.config)
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
