import {AfterViewInit, Component, inject, OnDestroy, OnInit} from '@angular/core';
import { DebounceDirective } from '../../directives/debounce.directive';
import {
  ColorModeService,
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarModule,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
} from '@coreui/angular';
import {CoreuiHeaderComponent} from './coreui-header/coreui-header.component';
import {CoreuiFooterComponent} from './coreui-footer/coreui-footer.component';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CoreuiMenuComponent} from './coreui-menu/coreui-menu.component';
import {NgScrollbarModule} from 'ngx-scrollbar';
import {RouterLink} from '@angular/router';
import {GlobalLoaderComponent} from './global-loader/global-loader.component';
import {Subscription} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';
import {DOCUMENT, NgFor} from '@angular/common';


import {NavigationService} from "../../components/navigation/navigation.service";
import {NgIf} from "@angular/common";
import {IconComponent} from "@coreui/icons-angular";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faClose, faQuestion, faSearch} from "@fortawesome/free-solid-svg-icons";

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
  ],
  templateUrl: './coreui.component.html',
  styleUrl: './coreui.component.css'
})
export class CoreuiComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly formBuilder = inject(FormBuilder);
  public readonly navSearch: FormGroup = this.formBuilder.group({
    "searchTerm": [''],
  });
  public searchTerm: string = 'A';
  public showSearch: boolean = true;
  public navigationService: NavigationService = inject(NavigationService);

  protected readonly faSearch = faSearch;
  protected readonly faClose = faClose;


  readonly #colorModeService = inject(ColorModeService);
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
      } else {
        this.document.body.classList.remove('dark-theme');
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
    if (osSystemDarkMode) {
      // Enable dark mode for Angular Material because the OS wants dark mode
      // quick and dirty hack
      setTimeout(() => this.document.body.classList.add('dark-theme'), 100);
    }

    if (coreUiTheme === 'auto' || coreUiTheme === null) {
      setTimeout(() => {
        // Force CoreUI to use the OS theme
        this.#colorModeService.colorMode.set('auto');
      }, 100);
    }
  }


  public runSearch(): void {
    let {searchTerm} = this.navSearch.value;
    this.searchTerm = searchTerm.toLowerCase();

    this.navigationService.search(this.searchTerm);

    console.error(this.navigationService.searchResults);
  }

  public clearSearch(): void {
    this.searchTerm = '';
  }


  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }

  protected readonly faQuestion = faQuestion;
}
