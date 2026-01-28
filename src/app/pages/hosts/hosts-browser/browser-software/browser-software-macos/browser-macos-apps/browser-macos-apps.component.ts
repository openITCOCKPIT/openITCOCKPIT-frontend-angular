import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    effect,
    inject,
    input,
    InputSignal,
    OnDestroy
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { DebounceDirective } from '../../../../../../directives/debounce.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { NoRecordsComponent } from '../../../../../../layouts/coreui/no-records/no-records.component';
import {
    PaginateOrScrollComponent
} from '../../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { TableLoaderComponent } from '../../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { XsButtonDirective } from '../../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
    BrowserSoftwareMacosAppHostRoot,
    BrowserSoftwareMacosAppParams,
    getDefaultBrowserSoftwareMacosAppParams
} from '../../browser-software.interface';
import { PaginatorChangeEvent } from '../../../../../../layouts/coreui/paginator/paginator.interface';
import { BrowserSoftwareService } from '../../browser-software.service';
import { PermissionsService } from '../../../../../../permissions/permissions.service';

@Component({
    selector: 'oitc-browser-macos-apps',
    imports: [
        AsyncPipe,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        ColComponent,
        ContainerComponent,
        DebounceDirective,
        FaIconComponent,
        FormControlDirective,
        FormDirective,
        FormsModule,
        InputGroupComponent,
        InputGroupTextDirective,
        MatSort,
        MatSortHeader,
        NavComponent,
        NavItemComponent,
        NoRecordsComponent,
        PaginateOrScrollComponent,
        RowComponent,
        TableDirective,
        TableLoaderComponent,
        TranslocoDirective,
        TranslocoPipe,
        XsButtonDirective,
        RouterLink
    ],
    templateUrl: './browser-macos-apps.component.html',
    styleUrl: './browser-macos-apps.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowserMacosAppsComponent implements OnDestroy {
    public hostId: InputSignal<number> = input<number>(0);
    private readonly subscriptions: Subscription = new Subscription();
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly BrowserSoftwareService = inject(BrowserSoftwareService);
    public readonly PermissionsService = inject(PermissionsService);

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    protected hideFilter: boolean = true;
    public params: BrowserSoftwareMacosAppParams = getDefaultBrowserSoftwareMacosAppParams();
    public apps?: BrowserSoftwareMacosAppHostRoot;

    constructor() {
        effect(() => {
            if (this.hostId() > 0) {
                this.load();
            }
        });
    }

    public load(): void {
        this.subscriptions.add(
            this.BrowserSoftwareService.getMacosApps(this.hostId(), this.params).subscribe((packages) => {
                this.apps = packages;
                this.cdr.markForCheck();
            })
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public toggleFilter() {
        this.hideFilter = !this.hideFilter;
    }

    // Callback when a filter has changed
    public onFilterChange(event: any) {
        this.params.page = 1;
        this.load();
    }

    // Callback for Paginator or Scroll Index Component
    public onPaginatorChange(change: PaginatorChangeEvent): void {
        this.params.page = change.page;
        this.params.scroll = change.scroll;
        this.load();
    }

    public resetFilter() {
        this.params = getDefaultBrowserSoftwareMacosAppParams();
        this.load();
    }

    // Callback when sort has changed
    public onSortChange(sort: Sort) {
        if (sort.direction) {
            this.params.sort = sort.active;
            this.params.direction = sort.direction;
            this.load();
        }
    }

    public onMassActionComplete(success: boolean): void {
    }
}


