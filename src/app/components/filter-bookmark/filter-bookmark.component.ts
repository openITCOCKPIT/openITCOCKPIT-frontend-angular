/*
 * Copyright (C) <2015>  <it-novum GmbH>
 *
 * This file is dual licensed
 *
 * 1.
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU General Public License as published by
 *     the Free Software Foundation, version 3 of the License.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU General Public License for more details.
 *
 *     You should have received a copy of the GNU General Public License
 *     along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * 2.
 *     If you purchased an openITCOCKPIT Enterprise Edition you can use this file
 *     under the terms of the openITCOCKPIT Enterprise Edition license agreement.
 *     License agreement and license key will be shipped with the order
 *     confirmation.
 */

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import {
    ButtonGroupComponent,
    CardHeaderComponent,
    ColComponent,
    ContainerComponent,
    ModalService,
    RowComponent
} from '@coreui/angular';
import { DELETE_SERVICE_TOKEN } from '../../tokens/delete-injection.token';
import { DeleteBookmarkModalComponent } from '../delete-bookmark-modal/delete-bookmark-modal.component';
import { ServiceIndexFilter } from "../../pages/services/services.interface";
import { HostsIndexFilter } from "../../pages/hosts/hosts.interface";

import { BookmarksObject, BookmarksParams } from './bookmarks.interface';
import { Subscription } from 'rxjs';
import { BookmarksService } from './bookmarks.service';

import { GenericValidationError } from '../../generic-responses';
import { FilterBookmarkSaveModalComponent } from '../filter-bookmark-save-modal/filter-bookmark-save-modal.component';
import {
    FilterBookmarkExportModalComponent
} from '../filter-bookmark-export-modal/filter-bookmark-export-modal.component';
import { XsButtonDirective } from '../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { NotyService } from '../../layouts/coreui/noty.service';
import { DeleteAllItem } from '../../layouts/coreui/delete-all-modal/delete-all.interface';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NgOptionHighlightDirective } from '@ng-select/ng-option-highlight';
import { CustomAlertsIndexFilter } from '../../modules/customalert_module/pages/customalerts/customalerts.interface';


@Component({
    selector: 'oitc-filter-bookmark',
    imports: [
    TranslocoDirective,
    FaIconComponent,
    RowComponent,
    ColComponent,
    CardHeaderComponent,
    FilterBookmarkSaveModalComponent,
    XsButtonDirective,
    ButtonGroupComponent,
    DeleteBookmarkModalComponent,
    FilterBookmarkExportModalComponent,
    NgSelectModule,
    FormsModule,
    NgOptionHighlightDirective,
    ContainerComponent
],
    templateUrl: './filter-bookmark.component.html',
    styleUrl: './filter-bookmark.component.css',
    providers: [
        {provide: DELETE_SERVICE_TOKEN, useClass: BookmarksService}
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterBookmarkComponent implements OnInit, OnDestroy {
    @Input({required: true}) public plugin: string = '';
    @Input({required: true}) public controller: string = '';
    @Input({required: true}) public action: string = '';
    @Input({required: false}) public filter!: ServiceIndexFilter | HostsIndexFilter | CustomAlertsIndexFilter;
    @Output() selected = new EventEmitter<string>();
    public bookmarks: BookmarksObject[] = [];
    public selectedBookmarkId: Number | null = null;
    public selectedBookmark: BookmarksObject | null = null;
    public errors: GenericValidationError | null = null;
    public showEdit: boolean = false;
    public computedUrl: string = '';
    public params: BookmarksParams = {
        angular: true,
        plugin: '',
        controller: '',
        action: ''
    };
    public actionType: string = '';
    public deleteItems: any[] = [];
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private init: boolean = false;
    private filterUuid: string | null = null;
    private subscriptions: Subscription = new Subscription();
    private BookmarksService: BookmarksService = inject(BookmarksService);
    private readonly modalService = inject(ModalService);
    private readonly notyService = inject(NotyService);

    private cdr = inject(ChangeDetectorRef);


    constructor(private router: Router, private activatedRoute: ActivatedRoute) {
        // subscribe to router event
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            if (params['filter'] && params['filter'] !== '') {
                this.filterUuid = params['filter'];
                this.cdr.markForCheck();
            }
        });
    }

    loadBookmarks(id: number | null) {
        if (this.filterUuid != null) {
            this.params['queryFilter'] = this.filterUuid;
        }
        this.params.plugin = this.plugin;
        this.params.controller = this.controller;
        this.params.action = this.action;
        this.subscriptions.add(this.BookmarksService.getBookmarksIndex(this.params)
            .subscribe((result) => {
                this.cdr.markForCheck();
                this.bookmarks = result.bookmarks || [];
                if (result.bookmark !== null && result.bookmark.ownership === true) {
                    this.selectedBookmark = result.bookmark;
                    this.selectedBookmarkId = this.selectedBookmark.id;

                    setTimeout(() => {
                        if (this.selectedBookmark !== null) {
                            this.selected.emit(this.selectedBookmark.filter);
                            this.showEdit = true;
                        }
                    }, 300);
                }

                if (result.bookmark !== null && result.bookmark.ownership === false) {
                    this.selectedBookmark = null;
                    this.selectedBookmarkId = null;
                    this.showEdit = false;
                    setTimeout(() => {
                        if (result.bookmark !== null) {
                            this.selected.emit(result.bookmark.filter);
                            this.showEdit = false;
                            this.cdr.markForCheck();
                        }
                    }, 300);

                }

                if (id) {
                    if (this.bookmarks.length > 0) {
                        this.selectedBookmarkId = Number(id);
                        const selectedBookmark = this.bookmarks.find(bookmark => bookmark.id === this.selectedBookmarkId);
                        if (selectedBookmark) {
                            this.selectedBookmark = selectedBookmark;
                        }
                    }
                }
            })
        );

    }

    // Called by (click) - no manual change detection required
    computeBookmarkUrl() {
        if (this.selectedBookmark && this.selectedBookmark.uuid != '') {
            const baseUrl = location.href;
            let stringParams: HttpParams = new HttpParams();
            stringParams = stringParams.appendAll({filter: this.selectedBookmark.uuid})
            this.computedUrl = baseUrl + '?' + stringParams.toString();

            setTimeout(() => {
                this.modalService.toggle({
                    show: true,
                    id: 'bookmarkExportModal',
                });
            }, 0);
        }

    }

    onBookmarkChange() {
        if (this.selectedBookmarkId === null) {
            this.selected.emit('');
            this.showEdit = false;
            this.selectedBookmark = null;
            this.router.navigate([this.controller.toLowerCase(), this.action.toLowerCase()], {
                queryParams: {filter: null},
                queryParamsHandling: 'merge',
            });
            return;
        }
        const selectedBookmark = this.bookmarks.find(bookmark => bookmark.id === this.selectedBookmarkId);
        if (selectedBookmark) {
            this.selectedBookmark = selectedBookmark
            this.selected.emit(selectedBookmark.filter);
        }
        this.showEdit = true;
        if (this.filterUuid != null && selectedBookmark != null) {
            this.router.navigate([this.controller.toLowerCase(), this.action.toLowerCase()], {
                queryParams: {filter: selectedBookmark.uuid},
                queryParamsHandling: 'merge',
            });
        }
    }

    updateBookmark() {
        if (this.selectedBookmark) {
            this.selectedBookmark.filter = JSON.parse(JSON.stringify(this.filter));
            this.subscriptions.add(this.BookmarksService.update(this.selectedBookmark, this.selectedBookmark.id)
                .subscribe((result) => {
                    this.cdr.markForCheck();
                    if (result.success) {
                        if (this.selectedBookmark) {
                            const title = this.TranslocoService.translate('Bookmark');
                            const msg = this.TranslocoService.translate('updated successfully');

                            this.notyService.genericSuccess(msg, title);
                            this.loadBookmarks(null);
                            this.showEdit = true;
                        }
                    } else {
                        this.notyService.genericError();
                    }
                })
            );
        }
    }

    editBookmark() {
        this.actionType = 'edit';
        setTimeout(() => {
            this.modalService.toggle({
                show: true,
                id: 'filterBookmarkSaveModal',
            });
        }, 0);

    }

    showNewBookmarkModel() {
        this.actionType = 'create';
        setTimeout(() => {
            this.modalService.toggle({
                show: true,
                id: 'filterBookmarkSaveModal',
            });
        }, 0);
    }

    savedNewBookmark(id: string) {
        this.loadBookmarks(Number(id));
        this.showEdit = true;
    }

    toggleDeleteAllModal() {
        let items: DeleteAllItem[] = [];
        if (this.selectedBookmark) {
            // User just want to delete a single command
            items = [{
                id: Number(this.selectedBookmark.id),
                displayName: String(this.selectedBookmark.name)
            }];

            this.deleteItems = items;

            // open modal
            this.modalService.toggle({
                show: true,
                id: 'deleteBookmarkModal',
            });
        }
    }

    ngOnInit() {
        this.loadBookmarks(null);
    }

    deleted($result: boolean) {
        this.cdr.markForCheck();
        if ($result) {
            this.selectedBookmark = null;
            this.selectedBookmarkId = null;
            this.filterUuid = null;
            this.loadBookmarks(null);
            this.showEdit = false
            this.selected.emit('');
            this.router.navigate([this.controller.toLowerCase(), this.action.toLowerCase()]);
        }
        if (!$result) {
            this.notyService.genericError();
        }

    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}
