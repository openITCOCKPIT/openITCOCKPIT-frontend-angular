import { Component,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {TranslocoDirective, TranslocoService} from '@jsverse/transloco';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {NgIf} from '@angular/common';
import {
    CardHeaderComponent,
    ColComponent,
    RowComponent,
    DropdownComponent,
    DropdownItemDirective,
    DropdownMenuDirective,
    DropdownToggleDirective,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormLabelDirective,
    ModalService, NavComponent, NavItemComponent,

} from '@coreui/angular';
import {
    ServiceIndexFilter,
    ServiceObject,
    ServiceParams,
    ServicesIndexRoot,
    ServicesCurrentStateFilter,
    getServiceCurrentStateForApi,
} from "../../pages/services/services.interface";
import {SelectComponent} from '../../layouts/primeng/select/select/select.component';
import {BookmarksObject, BookmarksParams, BookmarksIndexRoot} from './bookmarks.interface';
import {Subscription} from 'rxjs';
import {BookmarksService} from './bookmarks.service';
import {FormErrorDirective} from '../../layouts/coreui/form-error.directive';
import {GenericValidationError} from '../../generic-responses';
import {SelectKeyValue} from '../../layouts/primeng/select.interface';
import { MultiSelectModule } from 'primeng/multiselect';
import { FilterBookmarkSaveModalComponent } from  '../filter-bookmark-save-modal/filter-bookmark-save-modal.component';
import {XsButtonDirective} from '../../layouts/coreui/xsbutton-directive/xsbutton.directive';
import { NotyService } from '../../layouts/coreui/noty.service';


@Component({
    selector: 'oitc-filter-bookmark',
    standalone: true,
    imports: [
        TranslocoDirective,
        FaIconComponent,
        NgIf,
        RowComponent,
        ColComponent,
        SelectComponent,
        FormErrorDirective,
        CardHeaderComponent,
        MultiSelectModule,
        DropdownComponent,
        DropdownItemDirective,
        DropdownMenuDirective,
        DropdownToggleDirective,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormControlDirective,
        FormDirective,
        FormLabelDirective,
        FilterBookmarkSaveModalComponent,
        XsButtonDirective,
        NavComponent,
        NavItemComponent
    ],
    templateUrl: './filter-bookmark.component.html',
    styleUrl: './filter-bookmark.component.css'
})
export class FilterBookmarkComponent implements OnInit, OnDestroy {
    @Input({required: true}) public plugin: string = '';
    @Input({required: false}) public controller: string = '';
    @Input({required: false}) public action: string = '';
    @Input({required: false}) public filter!: ServiceIndexFilter;
    @Output() selected = new EventEmitter<string>();
    public bookmarks: BookmarksObject[] = [];
    public selectedBookmarkId: Number | null = null;
    public selectedBookmark: BookmarksObject | null = null;
    public errors: GenericValidationError | null = null;
    public showEdit: boolean = false;
    public params: BookmarksParams = {
        angular: true,
        plugin: '',
        controller: 'Services',
        action: 'index'
    };
    private subscriptions: Subscription = new Subscription();
    private BookmarksService: BookmarksService = inject(BookmarksService);
    private readonly modalService = inject(ModalService);
    private readonly notyService = inject(NotyService);
    public TranslocoService: TranslocoService = inject(TranslocoService);

    loadBookmarks (selectItem: string | null) {
        this.subscriptions.add(this.BookmarksService.getBookmarksIndex(this.params)
            .subscribe((result) => {
                this.bookmarks = result.bookmarks
            })
        );
    }

    computeBookmarkUrl () {

    }

    onBookmarkChange () {
        const selectedBookmark = this.bookmarks.find(bookmark => bookmark.id === this.selectedBookmarkId);
        if (selectedBookmark) {
            this.selectedBookmark = selectedBookmark
            this.selected.emit(selectedBookmark.filter);
        }
        this.showEdit = true;
    }

    updateBookmark () {
        if (this.selectedBookmark) {
            this.selectedBookmark.filter = JSON.parse(JSON.stringify(this.filter));
            this.subscriptions.add(this.BookmarksService.update(this.selectedBookmark, this.selectedBookmark.id)
                .subscribe((result) => {
                    if (result.success) {
                        console.log(result)
                        if(this.selectedBookmark) {
                            const title = this.TranslocoService.translate('Bookmark');
                            const msg = this.TranslocoService.translate('updated successfully');

                            this.notyService.genericSuccess(msg, title);
                            this.loadBookmarks(null);
                        }
                    } else {
                        this.notyService.genericError();
                    }
                })
            );
        }
    }

    showNewBookmarkModel () {
        this.modalService.toggle({
            show: true,
            id: 'filterBookmarkSaveModal',
        });
    }

    savedNewBookmark (id: string) {
        this.loadBookmarks(id);
        this.selectedBookmarkId = Number(id);
        const selectedBookmark = this.bookmarks.find(bookmark => bookmark.id === this.selectedBookmarkId);
        if (selectedBookmark) {
            this.selected.emit(selectedBookmark.filter);
        }
    }

    ngOnInit () {
        this.loadBookmarks(null);
    }

    ngOnDestroy () {
        this.subscriptions.unsubscribe();
    }

}
