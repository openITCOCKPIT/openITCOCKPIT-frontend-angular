import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { ColorModeService, ContainerComponent, ModalService, ShadowOnScrollDirective } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { HistoryService } from './history.service';
//import { TranslocoService } from '@jsverse/transloco';
//import { NgSelectConfig } from '@ng-select/ng-select';

import { CoreuiHeaderComponent } from './layouts/coreui/coreui-header/coreui-header.component';
import { CoreuiNavbarComponent } from './layouts/coreui/coreui-navbar/coreui-navbar.component';
import { GlobalLoaderComponent } from './layouts/coreui/global-loader/global-loader.component';
import { AsyncPipe, DOCUMENT, NgClass, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { LayoutOptions, LayoutService } from './layouts/coreui/layout.service';

import {
    MessageOfTheDayModalComponent
} from './components/message-of-the-day-modal/message-of-the-day-modal.component';
import { CurrentMessageOfTheDay } from './pages/messagesotd/messagesotd.interface';
import { MessagesOfTheDayService } from './pages/messagesotd/messagesotd.service';
import { AuthService } from './auth/auth.service';
import { TitleService } from './services/title.service';
import { SystemnameService } from './services/systemname.service';

@Component({
    selector: 'oitc-root',
    imports: [
    RouterOutlet,
    FontAwesomeModule,
    ContainerComponent,
    CoreuiHeaderComponent,
    CoreuiNavbarComponent,
    GlobalLoaderComponent,
    ShadowOnScrollDirective,
    NgIf,
    AsyncPipe,
    NgClass,
    MessageOfTheDayModalComponent
],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy, AfterViewInit {

    // Inject HistoryService to keep track of the previous URLs
    private historyService: HistoryService = inject(HistoryService);

    // I am the current messageOfTheDay.
    protected messageOfTheDay: CurrentMessageOfTheDay = {} as CurrentMessageOfTheDay;

    private readonly TitleService: TitleService = inject(TitleService);
    public readonly LayoutService = inject(LayoutService);
    private readonly document = inject(DOCUMENT);
    private navigationEndEvent: NavigationEnd | null = null;

    protected systemName: string = '';

    private subscription: Subscription = new Subscription();

    constructor(library: FaIconLibrary,
                private router: Router,
                private IconSetService: IconSetService,
               // private selectConfig: NgSelectConfig,
               // private TranslocoService: TranslocoService,
                private colorService: ColorModeService,
                private cdr: ChangeDetectorRef,
                private MessageOfTheDayService: MessagesOfTheDayService,
                private readonly AuthService: AuthService,
                private readonly SystemnameService: SystemnameService,
                private readonly ModalService: ModalService,
    ) {
        // Add an icon to the library for convenient access in other components
        library.addIconPacks(fas);
        library.addIconPacks(far);
        library.addIconPacks(fab);

        this.IconSetService.icons = {...iconSubset};

       // this.selectConfig.notFoundText = this.TranslocoService.translate('No entries match the selection');
        //this.selectConfig.placeholder = this.TranslocoService.translate('Please choose');


        // This is to sync the selected theme color from CoreUI with Angular Material
        // --force --brechstange
        const colorMode$ = toObservable(this.colorService.colorMode);


        // Subscribe to the color mode changes (drop down menu in header)
        this.subscription.add(colorMode$.subscribe((theme) => {

            // theme can be one of 'light', 'dark', 'auto'
            if (theme === 'dark') {
                this.document.body.classList.add('dark-theme');
                this.document.querySelector("html")!.classList.add("dark-theme"); // PrimeNG needs this
                this.LayoutService.setTheme('dark');
            } else if (theme === 'auto') {
                const osSystemDarkModeEnabled = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (osSystemDarkModeEnabled) {
                    this.LayoutService.setTheme('dark');
                } else {
                    this.LayoutService.setTheme('light');
                }
            } else {
                this.document.body.classList.remove('dark-theme');
                this.document.querySelector("html")!.classList.remove("dark-theme"); // PrimeNG needs this
                this.LayoutService.setTheme('light');
            }
        }));

        // Fetch the message of the day
        this.watchMessageOfTheDay();

        // Fetch the systemname
        this.watchSystemname();
    }

    private watchSystemname(): void {
        this.subscription.add(this.SystemnameService.systemName$.subscribe((systemName: string) => {
            this.systemName = `${systemName}`;
            this.TitleService.setSystemName(systemName);
        }));
    }

    private watchMessageOfTheDay(): void {
        this.subscription.add(this.AuthService.authenticated$.subscribe((isLoggedIn) => {
            if (!isLoggedIn) {
                return;
            }
            // Solely fetch the current message of the day.
            this.subscription.add(this.MessageOfTheDayService.getCurrentMessageOfTheDay().subscribe((message: CurrentMessageOfTheDay) => {
                if (!message.messageOtdAvailable) {
                    this.cdr.markForCheck();
                    return;
                }
                this.messageOfTheDay = message;
                if (!message.showMessageAfterLogin) {
                    this.cdr.markForCheck();
                    return;
                }
                window.setTimeout(() => {
                    this.ModalService.toggle({
                        show: true,
                        id: 'messageOfTheDayModal'
                    });
                }, 500)
                this.cdr.markForCheck();
            }));
        }));
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngAfterViewInit(): void {
        // Subscribe to route changes
        this.subscription.add(this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.navigationEndEvent = event;
                this.cdr.markForCheck();
                // Leave title empty to let the TitleService figure out the title itself.
                this.TitleService.setTitle();
            }
        }));

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
