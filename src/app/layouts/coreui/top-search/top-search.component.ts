import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { TranslocoDirective, TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import {
    DropdownComponent,
    DropdownDividerDirective,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormControlDirective,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective
} from '@coreui/angular';
import { XsButtonDirective } from '../xsbutton-directive/xsbutton.directive';
import { Router, RouterLink } from '@angular/router';
import { PermissionsService } from '../../../permissions/permissions.service';
import { PermissionDirective } from '../../../permissions/permission.directive';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { UUID } from '../../../classes/UUID';
import { SearchService } from '../../../search/search.service';
import { SearchType } from '../../../search/search-type.enum';
import { Subscription } from 'rxjs';

@Component({
    selector: 'oitc-top-search',
    standalone: true,
    imports: [
        TranslocoDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        FormControlDirective,
        FormDirective,
        DropdownComponent,
        DropdownToggleDirective,
        DropdownMenuDirective,
        DropdownItemDirective,
        DropdownDividerDirective,
        XsButtonDirective,
        RouterLink,
        TranslocoPipe,
        PermissionDirective,
        NgClass,
        FaIconComponent,
        NgIf,
        FormsModule,
        AsyncPipe
    ],
    templateUrl: './top-search.component.html',
    styleUrl: './top-search.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopSearchComponent implements OnDestroy {

    public readonly PermissionsService: PermissionsService = inject(PermissionsService)
    public readonly TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly SearchService = inject(SearchService);
    private readonly router = inject(Router);

    public currentSearchType: SearchType = SearchType.Host;
    public currentSearchTypeTranslation: string = this.TranslocoService.translate('Hosts');
    public searchStr: string = '';
    public isSearching: boolean = false;

    private subscriptions: Subscription = new Subscription();

    private cdr = inject(ChangeDetectorRef);

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    // Called by ngSubmit, no manual change detection required
    public doSearch() {
        if (this.searchStr === '') {
            return;
        }

        this.isSearching = true;

        const uuid = new UUID();
        if (uuid.isUuid(this.searchStr)) {
            this.setSearchType(SearchType.UUID, this.TranslocoService.translate('UUID'));
        }

        if (this.currentSearchType === SearchType.UUID) {
            // Query the server if the UUID is known
            this.subscriptions.add(this.SearchService.searchUUID(this.searchStr)
                .subscribe((result) => {
                    this.isSearching = false;
                    if (result.hasPermission) {
                        this.router.navigate(result.url, {
                            queryParams: {
                                id: result.id
                            }
                        });
                    } else {
                        this.router.navigate(['/error/403']);
                    }
                })
            );

        } else {
            // Default search by host name, service name etc. - no request required just redirect to the
            // corresponding page with the search string as a query parameter
            this.SearchService.redirectSearch(this.currentSearchType, this.searchStr);
            this.isSearching = false;
        }
    }

    // Called by (click) - no manual change detection required
    public setSearchType(searchType: SearchType, translation: string) {
        this.currentSearchType = searchType;
        this.currentSearchTypeTranslation = translation;
    }


    protected readonly SearchType = SearchType;
}
