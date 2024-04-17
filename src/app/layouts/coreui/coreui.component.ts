import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  ColorModeService,
  ContainerComponent,
  INavData,
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
import { CoreuiHeaderComponent } from './coreui-header/coreui-header.component';
import { CoreuiFooterComponent } from './coreui-footer/coreui-footer.component';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import { CoreuiMenuComponent } from './coreui-menu/coreui-menu.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { RouterLink } from '@angular/router';
import { GlobalLoaderComponent } from './global-loader/global-loader.component';
import { Subscription } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { DOCUMENT } from '@angular/common';


import {NavigationService} from "../../components/navigation/navigation.service";
import {NgIf} from "@angular/common";
import {IconComponent} from "@coreui/icons-angular";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faClose, faSearch} from "@fortawesome/free-solid-svg-icons";
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
  public searchTerm : string = 'A';
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
  public runSearch(): void
  {
    let {searchTerm} = this.navSearch.value;
    this.searchTerm = searchTerm;
    console.error(this.searchTerm);
  }
  public clearSearch(): void{
    this.searchTerm = '';
  }

  public navItems: INavData[] = [
    {
      name: 'Dashboard',
      url: '/dashboard',
      iconComponent: {name: 'cil-speedometer'},
      badge: {
        color: 'info',
        text: 'NEW'
      }
    },
    {
      title: true,
      name: 'Theme'
    },
    {
      name: 'Colors',
      url: '/theme/colors',
      iconComponent: {name: 'cil-drop'}
    },
    {
      name: 'Typography',
      url: '/theme/typography',
      linkProps: {fragment: 'headings'},
      iconComponent: {name: 'cil-pencil'}
    },
    {
      name: 'Components',
      title: true
    },
    {
      name: 'Base',
      url: '/base',
      iconComponent: {name: 'cil-puzzle'},
      children: [
        {
          name: 'Accordion',
          url: '/base/accordion',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Breadcrumbs',
          url: '/base/breadcrumbs',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Cards',
          url: '/base/cards',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Carousel',
          url: '/base/carousel',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Collapse',
          url: '/base/collapse',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'List Group',
          url: '/base/list-group',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Navs & Tabs',
          url: '/base/navs',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Pagination',
          url: '/base/pagination',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Placeholder',
          url: '/base/placeholder',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Popovers',
          url: '/base/popovers',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Progress',
          url: '/base/progress',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Spinners',
          url: '/base/spinners',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Tables',
          url: '/base/tables',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Tabs',
          url: '/base/tabs',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Tooltips',
          url: '/base/tooltips',
          icon: 'nav-icon-bullet'
        }
      ]
    },
    {
      name: 'Buttons',
      url: '/buttons',
      iconComponent: {name: 'cil-cursor'},
      children: [
        {
          name: 'Buttons',
          url: '/buttons/buttons',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Button groups',
          url: '/buttons/button-groups',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Dropdowns',
          url: '/buttons/dropdowns',
          icon: 'nav-icon-bullet'
        }
      ]
    },
    {
      name: 'Forms',
      url: '/forms',
      iconComponent: {name: 'cil-notes'},
      children: [
        {
          name: 'Form Control',
          url: '/forms/form-control',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Select',
          url: '/forms/select',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Checks & Radios',
          url: '/forms/checks-radios',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Range',
          url: '/forms/range',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Input Group',
          url: '/forms/input-group',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Floating Labels',
          url: '/forms/floating-labels',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Layout',
          url: '/forms/layout',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Validation',
          url: '/forms/validation',
          icon: 'nav-icon-bullet'
        }
      ]
    },
    {
      name: 'Charts',
      iconComponent: {name: 'cil-chart-pie'},
      url: '/charts'
    },
    {
      name: 'Icons',
      iconComponent: {name: 'cil-star'},
      url: '/icons',
      children: [
        {
          name: 'CoreUI Free',
          url: '/icons/coreui-icons',
          icon: 'nav-icon-bullet',
          badge: {
            color: 'success',
            text: 'FREE'
          }
        },
        {
          name: 'CoreUI Flags',
          url: '/icons/flags',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'CoreUI Brands',
          url: '/icons/brands',
          icon: 'nav-icon-bullet'
        }
      ]
    },
    {
      name: 'Notifications',
      url: '/notifications',
      iconComponent: {name: 'cil-bell'},
      children: [
        {
          name: 'Alerts',
          url: '/notifications/alerts',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Badges',
          url: '/notifications/badges',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Modal',
          url: '/notifications/modal',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Toast',
          url: '/notifications/toasts',
          icon: 'nav-icon-bullet'
        }
      ]
    },
    {
      name: 'Widgets',
      url: '/widgets',
      iconComponent: {name: 'cil-calculator'},
      badge: {
        color: 'info',
        text: 'NEW'
      }
    },
    {
      title: true,
      name: 'Extras'
    },
    {
      name: 'Pages',
      url: '/login',
      iconComponent: {name: 'cil-star'},
      children: [
        {
          name: 'Login',
          url: '/login',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Register',
          url: '/register',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Error 404',
          url: '/404',
          icon: 'nav-icon-bullet'
        },
        {
          name: 'Error 500',
          url: '/500',
          icon: 'nav-icon-bullet'
        }
      ]
    },
    {
      title: true,
      name: 'Links',
      class: 'mt-auto'
    },
    {
      name: 'Docs',
      url: 'https://coreui.io/angular/docs/5.x/',
      iconComponent: {name: 'cil-description'},
      attributes: {target: '_blank'}
    }
  ];


  onScrollbarUpdate($event: any) {
    // if ($event.verticalUsed) {
    // console.log('verticalUsed', $event.verticalUsed);
    // }
  }

}
