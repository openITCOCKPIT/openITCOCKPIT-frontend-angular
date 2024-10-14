import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, OnDestroy } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { TranslocoPipe } from '@jsverse/transloco';
import { MenuHeadline, MenuLink } from '../../../../components/navigation/navigation.interface';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DebounceDirective } from '../../../../directives/debounce.directive';
import { NgClass, NgIf } from '@angular/common';
import { PermissionsService } from '../../../../permissions/permissions.service';
import { UUID } from '../../../../classes/UUID';
import { SearchService } from '../../../../search/search.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'oitc-navbar-search',
    standalone: true,
    imports: [
        FaIconComponent,
        TranslocoPipe,
        RouterLink,
        FormsModule,
        DebounceDirective,
        NgIf,
        NgClass
    ],
    templateUrl: './navbar-search.component.html',
    styleUrl: './navbar-search.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarSearchComponent implements OnDestroy {

    public menu = input.required<MenuHeadline[]>();

    public searchString: string = '';
    public searchResult: MenuLink[] = [];

    // currentSelectedIndex starts with -1 instead of 0 so we can detact if a user search for "test" and hit enter
    // to start a search for host names
    // or if a user searched for "command" and hit an arrow key to select the menu record
    public currentSelectedIndex: number = -1;

    public isSearching: boolean = false;

    private router = inject(Router);
    private readonly PermissionService: PermissionsService = inject(PermissionsService);
    private readonly SearchService = inject(SearchService);

    private subscriptions: Subscription = new Subscription();
    private cdr = inject(ChangeDetectorRef);

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onKeydown(event: any) {
        if (this.searchString === "") {
            this.resetSearch();
            return;
        }

        const RETURN_KEY = 13;
        const ARROW_KEY_UP = 38;
        const ARROW_KEY_DOWN = 40;
        const ESC = 27;

        const resultLength = this.searchResult.length;

        switch (event.keyCode) {
            case ESC:
                this.resetSearch();
                return;

            case ARROW_KEY_DOWN:
                if (resultLength > this.currentSelectedIndex + 1) {
                    this.currentSelectedIndex++;
                }
                break;

            case ARROW_KEY_UP:
                if (this.currentSelectedIndex > 0) {
                    this.currentSelectedIndex--;
                }
                break;

            case RETURN_KEY:
                if (this.currentSelectedIndex > -1) {
                    // User has navigated in the search results so he wants to search for a menu record
                    const link: MenuLink = this.searchResult[this.currentSelectedIndex];
                    this.router.navigate([link.angularUrl]);
                    this.resetSearch();
                }

                if (this.currentSelectedIndex === -1) {
                    const uuid = new UUID();
                    if (uuid.isUuid(this.searchString)) {
                        // We have a UUID
                        this.isSearching = true;

                        this.subscriptions.add(this.SearchService.searchUUID(this.searchString)
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
                        // Search for host name
                        if (this.PermissionService.hasPermission(['hosts', 'index'])) {
                            this.router.navigate(['/hosts/index'], {queryParams: {hostname: this.searchString}});
                        }
                    }
                }

                break;

        }

    }

    public resetSearch(): void {
        this.searchString = '';
        this.searchResult = [];
        this.currentSelectedIndex = -1;
    }

    public searchMenu(event: any) {
        const result: MenuLink[] = [];

        this.menu().map(((item: MenuHeadline) => {
            item.items.map((link: MenuLink) => {
                // Has the link children?
                if (link.items) {
                    if (link.items.length === 0 && link.isAngular) {
                        // Single link, add to result set if matching
                        if (this.doesMatch(link, this.searchString)) {
                            result.push(link);
                        }
                    }

                    if (link.items.length > 0) {
                        link.items.map((subItem: MenuLink) => {
                            if (subItem.isAngular) {
                                // match
                                if (this.doesMatch(subItem, this.searchString)) {
                                    result.push(subItem);
                                }
                            }
                        });
                    }
                }

                if (typeof link.items === "undefined") {
                    // Direct link without children
                    if (link.isAngular) {
                        // Single link, add to result set if matching
                        if (this.doesMatch(link, this.searchString)) {
                            result.push(link);
                        }
                    }
                }

            });
        }));

        this.searchResult = result;
    }

    public doesMatch(link: MenuLink, search: string): boolean {
        // Check if link.name matches the search string
        if (link.name.toLowerCase().includes(search.toLowerCase())) {
            return true;
        }

        // Check if any of the link.tags matches the search string
        if (link.tags && link.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))) {
            return true;
        }

        // If none of the above conditions are met, return false
        return false;
    }

}
