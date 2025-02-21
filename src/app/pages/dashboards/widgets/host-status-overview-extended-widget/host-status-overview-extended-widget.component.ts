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

import { HostStatusOverviewExtendedWidgetConfig } from './host-status-overview-extended-widget.interface';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { HostStatusOverviewExtendedWidgetService } from './host-status-overview-extended-widget.service';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
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
import { HostgroupsLoadHostgroupsByStringParams } from '../../../hostgroups/hostgroups.interface';
import { HostgroupsService } from '../../../hostgroups/hostgroups.service';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import { MultiSelectComponent } from '../../../../layouts/primeng/multi-select/multi-select/multi-select.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import {
    RegexHelperTooltipComponent
} from '../../../../layouts/coreui/regex-helper-tooltip/regex-helper-tooltip.component';

@Component({
    selector: 'oitc-host-status-overview-extended-widget',
    imports: [
        FaIconComponent,
        NgIf,
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
    templateUrl: './host-status-overview-extended-widget.component.html',
    styleUrl: './host-status-overview-extended-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostStatusOverviewExtendedWidget extends BaseWidgetComponent implements OnDestroy, AfterViewInit {
    protected flipped = signal<boolean>(false);
    public readonly HostgroupsService: HostgroupsService = inject(HostgroupsService);

    public config?: HostStatusOverviewExtendedWidgetConfig;
    private readonly HostStatusOverviewExtendedWidgetService = inject(HostStatusOverviewExtendedWidgetService);
    public statusCount: number | null = null;
    public hostIds: number[] = [];
    public widgetHeight: number = 0;
    public widgetWidth: number = 0;
    public fontSize: number = 0;
    public fontSizeIcon: number = 0;
    public iconTopPosition: number = 0;
    protected hostgroups: SelectKeyValue[] = [];
    protected hostgroupsIds: number[] = [];
    public keywords: string[] = [];
    public notKeywords: string[] = [];
    private readonly notyService = inject(NotyService);
    public errors: GenericValidationError | null = null;

    @ViewChild('boxContainer') boxContainer?: ElementRef;

    constructor() {
        super();
        effect(() => {
            if (this.flipped()) {
                this.loadHostgroups('');
            }
            this.cdr.markForCheck();
        });
    }


    public override load() {
        if (this.widget) {
            this.subscriptions.add(this.HostStatusOverviewExtendedWidgetService.getHostStatusOverviewExtendedWidget(this.widget)
                .subscribe((result) => {
                    this.config = result.config;
                    this.statusCount = parseInt(result.statusCount, 10);
                    this.keywords = this.config.Host.keywords.split(',').filter(Boolean);
                    this.notKeywords = this.config.Host.not_keywords.split(',').filter(Boolean);
                    this.hostgroupsIds = this.config.Hostgroup._ids.split(',').map(Number).filter(Boolean);
                    this.hostIds = result.hostIds;
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

    protected loadHostgroups = (search: string) => {
        let hostgroupIds: number[] = [];
        if (this.config?.Hostgroup._ids) {
            hostgroupIds = this.config.Hostgroup._ids.split(',').map(Number);
        }
        this.subscriptions.add(this.HostgroupsService.loadHostgroupsByString({
            'filter[Containers.name]': search,
            'selected[]': hostgroupIds
        } as HostgroupsLoadHostgroupsByStringParams).subscribe((data: SelectKeyValue[]) => {
            this.hostgroups = data;
            this.cdr.markForCheck();
        }));
    }

    public submit() {
        if (!this.widget || !this.config) {
            return;
        }

        this.config.Host.keywords = this.keywords.join(',');
        this.config.Host.not_keywords = this.notKeywords.join(',');
        this.config.Hostgroup._ids = this.hostgroupsIds.join(',');


        this.subscriptions.add(this.HostStatusOverviewExtendedWidgetService.saveWidgetConfig(this.widget.id, this.config)
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
