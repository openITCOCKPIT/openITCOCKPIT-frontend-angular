import { Component, DestroyRef, inject, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
    AvatarComponent,
    BadgeComponent,
    BreadcrumbRouterComponent,
    ColorModeService,
    ContainerComponent,
    DropdownComponent,
    DropdownDividerDirective,
    DropdownHeaderDirective,
    DropdownItemDirective,
    DropdownMenuDirective,
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
import { ChangeLanguageComponent } from '../change-language/change-language.component';
import { SidebarService } from '../coreui-navbar/sidebar.service';
import { Subscription } from 'rxjs';
import { TopSearchComponent } from '../top-search/top-search.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { PermissionDirective } from '../../../permissions/permission.directive';

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
        IconDirective,
        ChangeLanguageComponent,
        TopSearchComponent,
        TranslocoDirective,
        FaIconComponent,
        PermissionDirective
    ],
    templateUrl: './coreui-header.component.html',
    styleUrl: './coreui-header.component.css'
})
export class CoreuiHeaderComponent extends HeaderComponent implements OnDestroy {
    @Input() sidebarId: string = 'sidebar1';

    readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    readonly #colorModeService = inject(ColorModeService);
    readonly colorMode = this.#colorModeService.colorMode;
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly sidebarService: SidebarService = inject(SidebarService);


    private readonly subscriptions: Subscription = new Subscription();

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

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public toggleShowOrHideSidebar() {
        this.sidebarService.toggleShowOrHideSidebar();
    }

}
