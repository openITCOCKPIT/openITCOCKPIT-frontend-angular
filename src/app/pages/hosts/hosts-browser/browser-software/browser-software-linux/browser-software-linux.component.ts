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
import { IndexPage } from '../../../../../pages.interface';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { PaginatorChangeEvent } from '../../../../../layouts/coreui/paginator/paginator.interface';
import { Subscription } from 'rxjs';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleDirective,
    ColComponent,
    ContainerComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    NavComponent,
    NavItemComponent,
    RowComponent,
    TableDirective
} from '@coreui/angular';
import { XsButtonDirective } from '../../../../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DebounceDirective } from '../../../../../directives/debounce.directive';
import { TableLoaderComponent } from '../../../../../layouts/primeng/loading/table-loader/table-loader.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { BadgeOutlineComponent } from '../../../../../layouts/coreui/badge-outline/badge-outline.component';
import {
    PaginateOrScrollComponent
} from '../../../../../layouts/coreui/paginator/paginate-or-scroll/paginate-or-scroll.component';
import { NoRecordsComponent } from '../../../../../layouts/coreui/no-records/no-records.component';
import { BrowserSoftwareService } from '../browser-software.service';
import { PermissionsService } from '../../../../../permissions/permissions.service';
import {
    BrowserSoftwareLinuxHostRoot,
    BrowserSoftwareLinuxParams,
    getDefaultBrowserSoftwareLinuxParams
} from '../browser-software.interface';
import { FormsModule } from '@angular/forms';
import { TrueFalseDirective } from '../../../../../directives/true-false.directive';

@Component({
    selector: 'oitc-browser-software-linux',
    imports: [
        TranslocoDirective,
        CardComponent,
        CardHeaderComponent,
        CardTitleDirective,
        NavItemComponent,
        NavComponent,
        XsButtonDirective,
        FaIconComponent,
        CardBodyComponent,
        ContainerComponent,
        RowComponent,
        ColComponent,
        FormDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        DebounceDirective,
        FormControlDirective,
        TranslocoPipe,
        FormCheckComponent,
        TableLoaderComponent,
        TableDirective,
        MatSort,
        MatSortHeader,
        RouterLink,
        AsyncPipe,
        BadgeOutlineComponent,
        PaginateOrScrollComponent,
        NoRecordsComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormsModule,
        TrueFalseDirective
    ],
    templateUrl: './browser-software-linux.component.html',
    styleUrl: './browser-software-linux.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowserSoftwareLinuxComponent implements OnDestroy, IndexPage {

    public hostId: InputSignal<number> = input<number>(0);

    private readonly subscriptions: Subscription = new Subscription();
    private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly TranslocoService = inject(TranslocoService);
    private readonly BrowserSoftwareService = inject(BrowserSoftwareService);
    public readonly PermissionsService = inject(PermissionsService);

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    protected hideFilter: boolean = true;
    public params: BrowserSoftwareLinuxParams = getDefaultBrowserSoftwareLinuxParams();
    public packages?: BrowserSoftwareLinuxHostRoot;

    constructor() {
        effect(() => {
            if (this.hostId() > 0) {
                this.load();
            }
        });
    }

    public load(): void {
        this.subscriptions.add(
            this.BrowserSoftwareService.getPackagesLinux(this.hostId(), this.params).subscribe((packages) => {
                this.packages = packages;
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
        this.params = getDefaultBrowserSoftwareLinuxParams();
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

