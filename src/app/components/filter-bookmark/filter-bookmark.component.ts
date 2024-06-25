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
    @Input({required: true}) public plugin: String = '';
    @Input({required: false}) public controller: string = '';
    @Input({required: false}) public action: string = '';
    @Input({required: false}) public filter!: ServiceIndexFilter;
    @Output() selected = new EventEmitter<string>();
    public bookmarks: BookmarksObject[] = [];
    public bookmarksSelect: SelectKeyValue[] = [];
    public selectedBookmarkId: Number | null = null;
    //public selectedBookmark: BookmarksObject | null = null;
    public errors: GenericValidationError | null = null;
    public showEdit: boolean = false;
    private params: BookmarksParams = {
        angular: true,
        plugin: '',
        controller: 'services',
        action: 'index'
    };
    private subscriptions: Subscription = new Subscription();
    private BookmarksService: BookmarksService = inject(BookmarksService);
    private readonly modalService = inject(ModalService);

    loadBookmarks (selectItem: string | null) {
        this.subscriptions.add(this.BookmarksService.getBookmarksIndex(this.params)
            .subscribe((result) => {
                this.bookmarks = result.bookmarks
                this.bookmarks.forEach((bookmark: BookmarksObject) => {
                    this.bookmarksSelect.push({
                        key: bookmark.id,
                        value: bookmark.name
                    })
                })

            })
        );
    }

    computeBookmarkUrl () {

    }

    onBookmarkChange () {
        const selectedBookmark = this.bookmarks.find(bookmark => bookmark.id === this.selectedBookmarkId);
        if (selectedBookmark) {
            this.selected.emit(selectedBookmark.filter);
        }
    }

    updateBookmark () {
    }

    showNewBookmarkModel () {
        this.modalService.toggle({
            show: true,
            id: 'filterBookmarkSaveModal',
        });
    }

    saveNewBookmark (name: string) {
        console.log('saveBookmark', name);
    }

    ngOnInit () {
        this.loadBookmarks(null);
    }

    ngOnDestroy () {
        this.subscriptions.unsubscribe();
    }

}
