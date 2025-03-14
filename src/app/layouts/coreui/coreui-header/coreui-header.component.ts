import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    inject,
    Input,
    input,
    OnDestroy
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
    ColorModeService,
    ContainerComponent,
    DropdownComponent,
    DropdownDividerDirective,
    DropdownHeaderDirective,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    HeaderComponent,
    HeaderNavComponent
} from '@coreui/angular';
import { delay, filter, map, tap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgTemplateOutlet } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ChangeLanguageComponent } from '../change-language/change-language.component';
import { SidebarService } from '../coreui-navbar/sidebar.service';
import { Subscription } from 'rxjs';
import { TopSearchComponent } from '../top-search/top-search.component';
import { TranslocoDirective } from '@jsverse/transloco';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { HeaderTimeComponent} from './header-time/header-time.component';
import { HeaderStatsComponent} from './header-stats/header-stats.component';
import { SystemHealthComponent} from './system-health/system-health.component';
import { HeaderEditionComponent} from './header-edition/header-edition.component';
import { HeaderExportComponent} from './header-export/header-export.component';

import {
    MessageOfTheDayButtonComponent
} from '../../../components/message-of-the-day-button/message-of-the-day-button.component';
import { CurrentMessageOfTheDay } from '../../../pages/messagesotd/messagesotd.interface';
import { HeaderAvatarComponent } from './header-avatar/header-avatar.component';
import { HeaderInfoService } from './header-info.service';
import {HeaderInfo} from './header-info.service';

@Component({
    selector: 'oitc-coreui-header',
    imports: [
        ContainerComponent,
        HeaderNavComponent,
        RouterLink,
        NgTemplateOutlet,
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
        PermissionDirective,
        MessageOfTheDayButtonComponent,
        HeaderAvatarComponent,
        HeaderTimeComponent,
        HeaderStatsComponent,
        SystemHealthComponent,
        HeaderEditionComponent,
        HeaderExportComponent
    ],
    templateUrl: './coreui-header.component.html',
    styleUrl: './coreui-header.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreuiHeaderComponent extends HeaderComponent implements OnDestroy {
    sidebarId = input('sidebar1');

    @Input({required: true}) public messageOfTheDay: CurrentMessageOfTheDay = {} as CurrentMessageOfTheDay;

    readonly #activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    readonly #colorModeService = inject(ColorModeService);
    readonly colorMode = this.#colorModeService.colorMode;
    readonly #destroyRef: DestroyRef = inject(DestroyRef);
    readonly sidebarService: SidebarService = inject(SidebarService);
    private readonly HeaderInfoService: HeaderInfoService = inject(HeaderInfoService);

    private cdr = inject(ChangeDetectorRef);

    private readonly subscriptions: Subscription = new Subscription();

    protected info:HeaderInfo = {
        exportRunningHeaderInfo: false,
        hasSubscription: false,
        isCommunityEdition: false,
    };

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
                    this.cdr.markForCheck();
                }),
                takeUntilDestroyed(this.#destroyRef)
            )
            .subscribe();
        this.getHeaderInfo();

    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    public toggleShowOrHideSidebar() {
        this.sidebarService.toggleShowOrHideSidebar();
    }

    public getHeaderInfo() {
        this.subscriptions.add(this.HeaderInfoService.getInfo().subscribe((data: HeaderInfo) => {
            this.info = data;
            this.cdr.markForCheck();
        }));
    }

}
