import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import 'flag-icons';
import { HistoryService } from './history.service';
import { TranslocoService } from '@jsverse/transloco';
import { NgSelectConfig } from '@ng-select/ng-select';
import { ColorModeService, ContainerComponent, ShadowOnScrollDirective } from '@coreui/angular';
import { CoreuiFooterComponent } from './layouts/coreui/coreui-footer/coreui-footer.component';
import { CoreuiHeaderComponent } from './layouts/coreui/coreui-header/coreui-header.component';
import { CoreuiNavbarComponent } from './layouts/coreui/coreui-navbar/coreui-navbar.component';
import { GlobalLoaderComponent } from './layouts/coreui/global-loader/global-loader.component';
import { AsyncPipe, DOCUMENT, NgClass, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { LayoutOptions, LayoutService } from './layouts/coreui/layout.service';

@Component({
    selector: 'oitc-root',
    standalone: true,
    imports: [
        RouterOutlet,
        FontAwesomeModule,
        ContainerComponent,
        CoreuiFooterComponent,
        CoreuiHeaderComponent,
        CoreuiNavbarComponent,
        GlobalLoaderComponent,
        ShadowOnScrollDirective,
        NgIf,
        AsyncPipe,
        NgClass
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy, AfterViewInit {

    // Inject HistoryService to keep track of the previous URLs
    private historyService: HistoryService = inject(HistoryService);

    public readonly LayoutService = inject(LayoutService);
    private readonly document = inject(DOCUMENT);

    private subscription: Subscription = new Subscription();

    constructor(library: FaIconLibrary,
                private IconSetService: IconSetService,
                private selectConfig: NgSelectConfig,
                private TranslocoService: TranslocoService,
                private colorService: ColorModeService,
                private cdr: ChangeDetectorRef
    ) {
        // Add an icon to the library for convenient access in other components
        library.addIconPacks(fas);
        library.addIconPacks(far);
        library.addIconPacks(fab);

        this.IconSetService.icons = {...iconSubset};

        this.selectConfig.notFoundText = this.TranslocoService.translate('No entries match the selection');
        this.selectConfig.placeholder = this.TranslocoService.translate('Please choose');


        // This is to sync the selected theme color from CoreUI with Angular Material
        // --force --brechstange
        const colorMode$ = toObservable(this.colorService.colorMode);


        // Subscribe to the color mode changes (drop down menu in header)
        this.subscription.add(colorMode$.subscribe((theme) => {

            // theme can be one of 'light', 'dark', 'auto'
            if (theme === 'dark') {
                this.document.body.classList.add('dark-theme');
                this.LayoutService.setTheme('dark');
            } else {
                this.document.body.classList.remove('dark-theme');
                this.LayoutService.setTheme('light');
            }

        }));
        
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngAfterViewInit(): void {
        const osSystemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const coreUiTheme: 'light' | 'dark' | 'auto' | null = this.colorService.getStoredTheme('coreui-free-angular-admin-template-theme-default');
        this.LayoutService.setTheme('light');

        if (osSystemDarkMode && coreUiTheme !== 'light') {
            // Enable dark mode for Angular Material because the OS wants dark mode
            // quick and dirty hack
            setTimeout(() => {
                this.LayoutService.setTheme('dark');
                this.document.body.classList.add('dark-theme');
            }, 100);
        }

        if (coreUiTheme === 'auto' || coreUiTheme === null) {
            setTimeout(() => {
                // Force CoreUI to use the OS theme
                this.colorService.colorMode.set('auto');
            }, 100);
        }
    }

    protected readonly LayoutOptions = LayoutOptions;
}
