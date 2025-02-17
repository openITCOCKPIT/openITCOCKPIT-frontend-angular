import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    inject,
    input,
    Input,
    OnDestroy,
    OnInit,
    signal,
    ViewChild
} from '@angular/core';
import { WidgetGetForRender } from '../../../../pages/dashboards/dashboards.interface';
import { Subscription } from 'rxjs';
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
import { WidgetsService } from '../../../../pages/dashboards/widgets/widgets.service';
import { PermissionsService } from '../../../../permissions/permissions.service';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { FormsModule } from '@angular/forms';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import { XsButtonDirective } from '../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { GenericValidationError } from '../../../../generic-responses';
import { NotyService } from '../../../../layouts/coreui/noty.service';

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
export class CustomalertsWidgetComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() widget!: WidgetGetForRender;
    private readonly subscriptions: Subscription = new Subscription();
    private readonly CustomAlertsService = inject(CustomAlertsService);
    private readonly WidgetsService = inject(WidgetsService);
    public CustomalertsFilter: CustomAlertsWidgetFilter = getCustomAlertsWidgetParams();
    public statusCount: number | null = null;
    protected flipped = signal<boolean>(false);
    public widgetHeight: number = 0;
    public widgetWidth: number = 0;
    public fontSize: number = 0;
    public fontSizeIcon: number = 0;
    public iconTopPosition: number = 0;
    isReadonly = input<boolean>(false);
    public readonly PermissionsService: PermissionsService = inject(PermissionsService);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);
    public errors: GenericValidationError | null = null;

    private cdr = inject(ChangeDetectorRef);

    @ViewChild('boxContainer') boxContainer?: ElementRef;

    constructor() {
        this.subscriptions.add(this.WidgetsService.onResizeEnded$.subscribe(event => {
            if (event.layoutItem.id === this.widget.id) {
                // Yes ich wurde resized
                this.resizeWidget();
            }
        }));

    }

    public ngOnInit(): void {
        this.load();
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private load() {
        this.subscriptions.add(
            this.CustomAlertsService.loadWidget(this.widget, this.CustomalertsFilter).subscribe((data: CustomAlertsWidget) => {
                this.CustomalertsFilter = data.config;
                this.statusCount = data.statusCount;
                this.cdr.markForCheck();
            })
        );
    }

    public resizeWidget() {
        let editButtonHeight = 21;
        if (this.isReadonly()) {
            //edit button is not visible
            editButtonHeight = 0;
        }
        this.widgetHeight = this.boxContainer?.nativeElement.offsetHeight - editButtonHeight; //21px height of button
        this.widgetWidth = this.boxContainer?.nativeElement.offsetWidth ; //21px height of button
        const scaleValue = Math.min(this.widgetHeight, this.widgetWidth);

        this.fontSize = scaleValue / 3;
        this.fontSizeIcon = scaleValue / 3;
        this.iconTopPosition = this.widgetHeight - this.fontSizeIcon - 10; //10px padding from bottom
        this.cdr.markForCheck();
    }

    public ngAfterViewInit(): void {
        this.resizeWidget();
    }

    public submit() {
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
