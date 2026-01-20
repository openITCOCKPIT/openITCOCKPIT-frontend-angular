import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    OnDestroy,
    signal,
    ViewChild
} from '@angular/core';

import { HostStatusOverviewWidgetConfig } from './host-status-overview-widget.interface';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { HostStatusOverviewWidgetService } from './host-status-overview-widget.service';
import { BaseWidgetComponent } from '../base-widget/base-widget.component';
import { KtdGridLayout, KtdResizeEnd } from '@katoid/angular-grid-layout';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AsyncPipe, NgClass } from '@angular/common';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { GenericValidationError } from '../../../../generic-responses';
import {
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective, InputGroupComponent, InputGroupTextDirective,
    RowComponent
} from '@coreui/angular';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { TrueFalseDirective } from '../../../../directives/true-false.directive';

@Component({
    selector: 'oitc-host-status-overview-widget',
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
        InputGroupComponent
    ],
    templateUrl: './host-status-overview-widget.component.html',
    styleUrl: './host-status-overview-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HostStatusOverviewWidgetComponent extends BaseWidgetComponent implements OnDestroy, AfterViewInit {
    protected flipped = signal<boolean>(false);
    public config?: HostStatusOverviewWidgetConfig;
    private readonly HostStatusOverviewWidgetService = inject(HostStatusOverviewWidgetService);
    public statusCount: number | null = null;
    public widgetHeight: number = 0;
    public widgetWidth: number = 0;
    public fontSize: number = 0;
    public fontSizeIcon: number = 0;
    public iconTopPosition: number = 0;
    private readonly notyService = inject(NotyService);
    public errors: GenericValidationError | null = null;

    @ViewChild('boxContainer') boxContainer?: ElementRef;


    public override load() {
        if (this.widget) {
            this.subscriptions.add(this.HostStatusOverviewWidgetService.getHostStatusOverviewWidget(this.widget)
                .subscribe((result) => {
                    this.config = result.config;
                    this.statusCount = parseInt(result.statusCount, 10);

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

    public submit() {
        if (!this.widget || !this.config) {
            return;
        }


        this.subscriptions.add(this.HostStatusOverviewWidgetService.saveWidgetConfig(this.widget.id, this.config)
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
