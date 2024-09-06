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

import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NotyService } from '../../layouts/coreui/noty.service';
import {
    ButtonCloseDirective,
    FormControlDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalService,
    ModalTitleDirective,
    RowComponent,
} from '@coreui/angular';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { BookmarksService } from '../filter-bookmark/bookmarks.service';
import { ServiceIndexFilter } from '../../pages/services/services.interface';
import { HostsIndexFilter } from "../../pages/hosts/hosts.interface";
import { BookmarkPost, BookmarkResponse, BookmarksObject } from '../filter-bookmark/bookmarks.interface';
import { GenericValidationError } from '../../generic-responses';
import { XsButtonDirective } from '../../layouts/coreui/xsbutton-directive/xsbutton.directive';


type NewBookmark = {
    name: string
    filter: string;
    favorite: boolean
}

@Component({
    selector: 'oitc-filter-bookmark-save-modal',
    standalone: true,
    imports: [
        TranslocoDirective,
        ModalComponent,
        ButtonCloseDirective,
        ModalHeaderComponent,
        ModalTitleDirective,
        XsButtonDirective,
        FaIconComponent,
        ModalFooterComponent,
        ModalBodyComponent,
        RowComponent,
        FormsModule,
        NgIf,
        FormControlDirective,
        NgClass
    ],
    templateUrl: './filter-bookmark-save-modal.component.html',
    styleUrl: './filter-bookmark-save-modal.component.css'
})
export class FilterBookmarkSaveModalComponent implements OnInit, OnDestroy {
    public newBookmark: NewBookmark = {
        name: '',
        filter: '',
        favorite: false
    };
    public error: boolean = false;
    public errors: GenericValidationError | null = null;

    @Input({required: true}) public actionType: string = '';
    @Input({required: true}) public bookmark: BookmarksObject | null = null;
    @Input({required: true}) public plugin: string = '';
    @Input({required: false}) public controller: string = '';
    @Input({required: false}) public action: string = '';
    @Input({required: false}) public filter!: ServiceIndexFilter | HostsIndexFilter;
    @Output() saved = new EventEmitter<string>();
    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    @ViewChild('modal') private modal!: ModalComponent;
    // private _actionType: string = '';
    private BookmarksService: BookmarksService = inject(BookmarksService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);


    public hideModal() {
        // this.bookmark = null;
        this.errors = null
        this.newBookmark = {
            name: '',
            filter: '',
            favorite: false
        };
        this.modalService.toggle({
            show: false,
            id: 'filterBookmarkSaveModal'
        });
    }

    public saveNewBookmark() {
        let post: BookmarkPost = {
            name: this.newBookmark.name,
            favorite: this.newBookmark.favorite,
            filter: JSON.parse(JSON.stringify(this.filter)), //Get clone not reference
            plugin: this.plugin,
            controller: this.controller,
            action: this.action
        };

        this.subscriptions.add(this.BookmarksService.add(post)
            .subscribe((result) => {
                if (result.success) {
                    const response = result.data as BookmarkResponse;
                    const title = this.TranslocoService.translate('Bookmark');
                    const msg = this.TranslocoService.translate('created successfully');

                    this.notyService.genericSuccess(msg, title);
                    this.saved.emit(response.bookmark.id.toString());
                    this.hideModal();
                    return;
                }

                // Error
                const errorResponse = result.data as GenericValidationError;
                this.notyService.genericError();
                if (result) {
                    this.errors = errorResponse;
                    this.error = true;
                }
            }))
    }


    public updateBookmark() {
        if (this.bookmark !== null) {
            this.bookmark.name = this.newBookmark.name
            this.bookmark.favorite = this.newBookmark.favorite
            const id = this.bookmark.id.toString();

            this.subscriptions.add(this.BookmarksService.update(this.bookmark, this.bookmark.id)
                .subscribe((result) => {
                    if (result.success) {
                        const title = this.TranslocoService.translate('Bookmark');
                        const msg = this.TranslocoService.translate('updated successfully');

                        this.notyService.genericSuccess(msg, title);
                        this.saved.emit(id);
                        this.hideModal();
                        return;

                    } else {
                        this.notyService.genericError();
                    }
                })
            );

        }

    }

    ngOnInit() {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            if (state.id === 'filterBookmarkSaveModal' && state.show === true) {

                if (this.actionType === 'edit' && this.bookmark !== null) {
                    this.newBookmark.name = this.bookmark.name;
                    this.newBookmark.favorite = this.bookmark.favorite
                }
            }
        }));

    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

}
