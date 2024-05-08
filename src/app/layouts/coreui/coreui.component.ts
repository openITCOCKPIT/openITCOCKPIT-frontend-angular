import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { DebounceDirective } from '../../directives/debounce.directive';
import {
    ColorModeService,
    ContainerComponent,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ShadowOnScrollDirective,
    SidebarBrandComponent,
    SidebarComponent,
    SidebarFooterComponent,
    SidebarHeaderComponent,
    SidebarModule,
    SidebarNavComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
} from '@coreui/angular';
import { CoreuiHeaderComponent } from './coreui-header/coreui-header.component';
import { CoreuiFooterComponent } from './coreui-footer/coreui-footer.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CoreuiMenuComponent } from './coreui-menu/coreui-menu.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { GlobalLoaderComponent } from './global-loader/global-loader.component';
import { Subscription } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { DOCUMENT, NgFor, NgIf } from '@angular/common';


import { NavigationService } from "../../components/navigation/navigation.service";
import { IconComponent } from "@coreui/icons-angular";
import { FaIconComponent, FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faClose, faQuestion, faSearch } from "@fortawesome/free-solid-svg-icons";
import { CoreuiNavbarComponent } from './coreui-navbar/coreui-navbar.component';
import { LayoutService } from './layout.service';

@Component({
    selector: 'oitc-coreui',
    standalone: true,
    imports: [
        ContainerComponent,
        IconComponent,
        InputGroupTextDirective,
        FormControlDirective,
        InputGroupComponent,
        CoreuiHeaderComponent,
        CoreuiFooterComponent,
        ShadowOnScrollDirective,
        DebounceDirective,
        CoreuiMenuComponent,
        FormsModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        SidebarComponent,
        SidebarHeaderComponent,
        SidebarBrandComponent,
        SidebarNavComponent,
        SidebarFooterComponent,
        SidebarToggleDirective,
        SidebarTogglerDirective,
        NgIf,
        NgFor,
        NgScrollbarModule,
        RouterLink,
        SidebarModule,
        GlobalLoaderComponent,
        FaIconComponent,
        CoreuiNavbarComponent,
        RouterOutlet,
    ],
    templateUrl: './coreui.component.html',
    styleUrl: './coreui.component.css'
})
export class CoreuiComponent implements OnInit, OnDestroy, AfterViewInit {
    public searchTerm: string = 'A';
    public showSearch: boolean = true;
    public navigationService: NavigationService = inject(NavigationService);
    protected readonly faSearch = faSearch;
    protected readonly faClose = faClose;
    protected readonly faQuestion = faQuestion;
    private readonly formBuilder = inject(FormBuilder);
    public readonly navSearch: FormGroup = this.formBuilder.group({
        "searchTerm": [''],
    });
    readonly #colorModeService = inject(ColorModeService);
    readonly LayoutService = inject(LayoutService);
    private readonly document = inject(DOCUMENT);
    private subscription: Subscription = new Subscription();

    constructor(colorService: ColorModeService) {
        // This is to sync the selected theme color from CoreUI with Angular Material
        // --force --brechstange

        const colorMode$ = toObservable(colorService.colorMode);


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

    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public ngAfterViewInit(): void {
        const osSystemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const coreUiTheme: 'light' | 'dark' | 'auto' | null = this.#colorModeService.getStoredTheme('coreui-free-angular-admin-template-theme-default');
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
                this.#colorModeService.colorMode.set('auto');
            }, 100);
        }
    }


    onScrollbarUpdate($event: any) {
        // if ($event.verticalUsed) {
        // console.log('verticalUsed', $event.verticalUsed);
        // }
    }
}
