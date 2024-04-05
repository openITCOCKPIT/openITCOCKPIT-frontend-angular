import { Component, DestroyRef, inject, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective, DropdownHeaderDirective,
  DropdownItemDirective, DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  NavItemComponent,
  SidebarToggleDirective
} from '@coreui/angular';
import { delay, filter, map, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgStyle, NgTemplateOutlet } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
@Component({
  selector: 'oitc-coreui-header',
  standalone: true,
  imports: [
    ContainerComponent,
    HeaderNavComponent,
    NavItemComponent,
    BreadcrumbRouterComponent,
    AvatarComponent,
    BadgeComponent,
    RouterLink,
    SidebarToggleDirective,
    NgTemplateOutlet,
    NgStyle,
    DropdownComponent,
    DropdownDividerDirective,
    DropdownHeaderDirective,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    IconDirective
  ],
  templateUrl: './coreui-header.component.html',
  styleUrl: './coreui-header.component.css'
})
export class CoreuiHeaderComponent extends HeaderComponent {
  readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;
  readonly #destroyRef: DestroyRef = inject(DestroyRef);

  constructor() {
    super();
    this.#colorModeService.localStorageItemName.set('coreui-free-angular-admin-template-theme-default');
    this.#colorModeService.eventName.set('ColorSchemeChange');

    this.#activatedRoute.queryParams
      .pipe(
        delay(1),
        map(params => <string>params['theme']?.match(/^[A-Za-z0-9\s]+/)?.[0]),
        filter(theme => ['dark', 'light', 'auto'].includes(theme)),
        tap(theme => {
          this.colorMode.set(theme);
        }),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe();
  }

  @Input() sidebarId: string = 'sidebar1';

}
