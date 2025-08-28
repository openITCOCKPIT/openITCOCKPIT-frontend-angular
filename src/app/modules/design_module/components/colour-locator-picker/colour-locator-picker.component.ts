import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { InputGroupComponent, InputGroupTextDirective } from '@coreui/angular';
import { FormsModule } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ColorPickerDirective } from 'ngx-color-picker'
import { Subscription } from 'rxjs';
import { LayoutService } from '../../../../layouts/coreui/layout.service';

@Component({
    selector: 'oitc-colour-locator-picker',
    imports: [
        FormsModule,
        TranslocoDirective,
        FaIconComponent,
        InputGroupComponent,
        InputGroupTextDirective,
        ColorPickerDirective,
    ],
    templateUrl: './colour-locator-picker.component.html',
    styleUrl: './colour-locator-picker.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColourLocatorPickerComponent implements OnChanges, OnInit, OnDestroy {
    private readonly document = inject(DOCUMENT);
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    private readonly LayoutService = inject(LayoutService);
    private subscriptions: Subscription = new Subscription();

    @Input() public selector: string = '';
    @Input() public name: string = '';
    @Input() public attribute: string = '';
    @Input() public title: string = '';
    private _value = '';
    private changed: boolean = false;

    private theme: string = '';

    @Input()
    get value() {
        return this._value;
    }

    set value(val: string) {
        if (val !== this._value) {
            this._value = val;
            this.valueChange.emit(val);
            this.changed = true;
        }
    }

    @Output() valueChange = new EventEmitter<string>();

    public ngOnChanges(changes: SimpleChanges): void {
        this.cdr.markForCheck();
    }

    public ngOnInit(): void {
        this.changed = false;
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public constructor() {
        this.subscriptions.add(this.LayoutService.theme$.subscribe((theme) => {
            this.theme = '';
            if (theme === 'dark') {
                this.theme = 'dark';
            }

            this.cdr.markForCheck();
        }));
    }

    private getTargetElements(): NodeListOf<HTMLElement> | null {
        if (!this.selector) {
            return null;
        }
        const targetElements = this.document.querySelectorAll(this.selector) as NodeListOf<HTMLElement>;
        if (!targetElements) {
            return null;
        }
        return targetElements;
    }

    private getHighlightColour(): string {
        // If colour hasn't changed, use pink to highlight.
        //return this.changed ? this.value : '#FF00FF';
        return '#9381FF';
    }

    protected highlightElement(event: any): void {
        let targetElements = this.getTargetElements();
        if (!targetElements) {
            return;
        }
        targetElements.forEach(targetElement => {
            targetElement.style.removeProperty(this.attribute);
            // Always remove highlight, if mouseover add highlight back.
            if (event.type === 'mouseover') {
                targetElement.style.setProperty(this.attribute, this.getHighlightColour(), "important");
            }
        });
        this.cdr.markForCheck();
    }

    protected open(): void {
        const defaultColor = this.getDefaultcolorForKey(this.name);
        this.value = '#FF00FF'; // Pink as fallback
        if (defaultColor) {
            this.value = defaultColor;
        }

        this.cdr.markForCheck();
    }

    protected clear(): void {
        this.value = '';
        this.changed = false;
        this.cdr.markForCheck();
    }

    private getDefaultcolorForKey(key: string): string | false {
        // My first attempt was to mapp the keys to CSS variables, but due to CSS scoping
        // we can not access all variables from here.
        // Also, this was way too complicated for what it is worth.
        //
        // Honestly speaking we will probably never change the default colours but if we do
        // we can change them in here as well.


        if (this.theme === "dark") {
            const mappingDark = {
                // Layout, Header and Menu
                pageHeader: '#212631', // --cui-body-bg
                pageSidebar: '#212631', // --cui-sidebar-bg
                pageSidebarGradient: 'rgba(64, 132, 197, 0.06)',
                navTitle: 'rgba(255, 255, 255, 0.38)', // --cui-tertiary-color
                navMenu: 'rgba(255, 255, 255, 0.87)', // --cui-body-color
                navMenuHover: '#FFFFFF', // --cui-emphasis-color
                pageContentWrapper: '#1d222b',

                // Breadcrumbs
                breadcrumbNonLinks: 'rgba(255, 255, 255, 0.87)', // --cui-secondary-color
                breadcrumbLinks: 'rgb(126, 125, 217)', // --cui-link-hover-color-rgb

                // Tables
                tableBase: '#212631', // --cui-table-bg
                tableBaseFont: 'rgb(255, 255, 255)', // --cui-emphasis-color
                tableBorder: 'rgb(50, 58, 73)', // --cui-border-color
                tableHover: 'rgba(255, 255, 255, 0.075)', // --cui-table-hover-bg
                tableHoverFont: '#FFFFFF', // --cui-table-hover-color

                // Input Fields and Buttons
                btnDefault: '#1d222b',
                btnDefaultFont: '#eeecec',
                btnDefaultBorder: '#323a49',

                // Tabs
                navTab: '#282d37',
                navLink: 'rgb(94.2, 92.4, 207.6)', // --cui-nav-link-color
                navLinkHover: 'rgb(126.36, 124.92, 217.08)', // --cui-nav-link-hover-color

                // Maps
                mapText: 'rgba(255, 255, 255, 0.87)', // --cui-card-color
                mapBackground: '#212631', // --cui-body-bg


                // Panels, Cards
                cardBase: '#212631', // --cui-body-bg
                cardHeader: 'rgba(255, 255, 255, 0.03)', // --cui-body-color-rgb
                cardBaseFont: 'rgba(255, 255, 255, 0.87))', // --cui-heading-color
                cardHeaderFont: 'rgba(255, 255, 255, 0.87)', //--cui-card-title-color
            };

            if (key in mappingDark) {
                return mappingDark[key as keyof typeof mappingDark];
            }

            console.log('No default colour found in dark theme for key:', key, '. Using light theme as fallback.');
        }

        const mappingLight = {
            // Layout, Header and Menu
            pageHeader: '#FFFFFF', // --cui-body-bg
            pageSidebar: '#212631', // --cui-sidebar-bg
            pageSidebarGradient: 'rgba(64, 132, 197, 0.06)',
            navTitle: 'rgba(255, 255, 255, 0.38)', // --cui-tertiary-color
            navMenu: 'rgba(255, 255, 255, 0.87)', // --cui-body-color
            navMenuHover: '#FFFFFF', // --cui-emphasis-color
            pageContentWrapper: '#f2f3f7',

            // Breadcrumbs
            breadcrumbNonLinks: 'rgba(37, 42.92, 54.02, 0.95)', // --cui-secondary-color
            breadcrumbLinks: 'rgba(88,86, 214,  1)', // --cui-link-hover-color-rgb

            // Tables
            tableBase: '#FFFFFF', // --cui-table-bg
            tableBaseFont: '#080a0c', // --cui-emphasis-color
            tableBorder: '#e7eaee', // --cui-border-color
            tableHover: 'rgba(8, 10, 12, 0.075)', // --cui-table-hover-bg
            tableHoverFont: '#080a0c', // --cui-table-hover-color

            // Input Fields and Buttons
            btnDefault: '#f5f5f5',
            btnDefaultFont: '#444',
            btnDefaultBorder: 'rgba(0, 0, 0, 0.1)',

            // Tabs
            navTab: '#FFFFFF',
            navLink: '#5856d6', // --cui-nav-link-color
            navLinkHover: 'rgb(70.4, 68.8, 171.2)', // --cui-nav-link-hover-color

            // Maps
            mapText: 'rgba(37, 43, 54, 0.95)', // --cui-card-color
            mapBackground: '#FFFFFF', // --cui-body-bg

            // Panels, Cards
            cardBase: '#FFFFFF', // --cui-body-bg
            cardHeader: 'rgba(255, 255, 255, 0.03)', // --cui-body-color-rgb
            cardBaseFont: 'rgba(37, 43, 54, 0.95)', // --cui-heading-color
            cardHeaderFont: 'rgba(37, 43, 54, 0.95)', //--cui-card-title-color
        };

        if (key in mappingLight) {
            return mappingLight[key as keyof typeof mappingLight];
        }

        console.log('No default colour found for key:', key, 'in light color scheme');

        return false;
    }

    //private getColorOfCssVariable(variable: string): string {
    //    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    //}

}
