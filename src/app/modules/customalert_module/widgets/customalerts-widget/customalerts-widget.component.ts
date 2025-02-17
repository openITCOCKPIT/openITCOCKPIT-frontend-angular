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
import { CustomAlertsService } from '../../pages/customalerts/customalerts.service';
import {
    CustomAlertsWidget,
    CustomAlertsWidgetFilter,
    getCustomAlertsWidgetParams
} from '../../pages/customalerts/customalerts.interface';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
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
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericValidationError } from '../../../../generic-responses';
import { NotyService } from '../../../../layouts/coreui/noty.service';
import { BaseWidgetComponent } from '../../../../pages/dashboards/widgets/base-widget/base-widget.component';
import { KtdResizeEnd } from '@katoid/angular-grid-layout';

@Component({
    selector: 'oitc-customalerts-widget',
    imports: [
        FaIconComponent,
        NgIf,
        NgClass,
        RowComponent,
        ColComponent,
        AsyncPipe,
        TranslocoDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormsModule,
        DebounceDirective,
        FormControlDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        TranslocoPipe,
        XsButtonDirective
    ],
    templateUrl: './customalerts-widget.component.html',
    styleUrl: './customalerts-widget.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('flip', [
            state('false', style({transform: 'none'})),
            state('true', style({transform: 'rotateY(180deg)'})),
            transition('false <=> true', animate('0.8s ease-in-out'))
        ])
    ]
})
export class CustomalertsWidgetComponent extends BaseWidgetComponent implements OnDestroy, AfterViewInit {
    private readonly CustomAlertsService = inject(CustomAlertsService);
    public CustomalertsFilter: CustomAlertsWidgetFilter = getCustomAlertsWidgetParams();
    public statusCount: number | null = null;
    protected flipped = signal<boolean>(false);
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
            this.subscriptions.add(
                this.CustomAlertsService.loadWidget(this.widget, this.CustomalertsFilter).subscribe((data: CustomAlertsWidget) => {
                    this.CustomalertsFilter = data.config;
                    this.statusCount = data.statusCount;
                    this.cdr.markForCheck();
                })
            );
        }

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

    public submit() {
        if (!this.widget) {
            return;
        }
        this.subscriptions.add(this.CustomAlertsService.saveWidget(this.widget, this.CustomalertsFilter)
            .subscribe({
                next: (result) => {
                    this.cdr.markForCheck();
                    const title = this.TranslocoService.translate('Success');
                    const msg = this.TranslocoService.translate('Data saved successfully');

                    this.notyService.genericSuccess(msg, title);
                    this.notyService.scrollContentDivToTop();
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
