import {Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {NgIf} from '@angular/common';
import {CardHeaderComponent, ColComponent, RowComponent} from '@coreui/angular';
import { SelectComponent } from '../../layouts/primeng/select/select/select.component';
import { BookmarksObject, BookmarksParams, BookmarksIndexRoot } from './bookmarks.interface';
import { Subscription } from 'rxjs';
import { BookmarksService } from './bookmarks.service';
import {FormErrorDirective} from '../../layouts/coreui/form-error.directive';
import {GenericValidationError} from '../../generic-responses';
import { SelectKeyValue } from '../../layouts/primeng/select.interface';

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
        CardHeaderComponent
    ],
  templateUrl: './filter-bookmark.component.html',
  styleUrl: './filter-bookmark.component.css'
})
export class FilterBookmarkComponent implements OnInit, OnDestroy {
    @Input({required: true}) public plugin: String = '';
    @Input({required: false}) public controller: string = '';
    @Input({required: false}) public action: string = '';
    @Output() selected = new EventEmitter<string>();

    private params: BookmarksParams = {
        angular: true,
        plugin: '',
        controller: 'services',
        action: 'index'
    };

    public bookmarks: BookmarksObject[] = [];
    public bookmarksSelect: SelectKeyValue[] = [];
    public selectedBokkmarkId : Number | null = null;
    //public selectedBookmark: BookmarksObject | null = null;
    public errors: GenericValidationError | null = null;

    private subscriptions: Subscription = new Subscription();
    private BookmarksService: BookmarksService = inject(BookmarksService);

    public showEdit :boolean = false;

    loadBookmarks(selectItem: string | null) {
        this.subscriptions.add(this.BookmarksService.getBookmarksIndex(this.params)
            .subscribe((result) => {
                this.bookmarks = result.bookmarks
                this.bookmarks.forEach((bookmark : BookmarksObject) => {
                    this.bookmarksSelect.push({
                        key: bookmark.id,
                        value: bookmark.name
                    })
                })

            })
        );
    }
    computeBookmarkUrl() {

    }

    onBookmarkChange() {
      const selectedBookmark  =  this.bookmarks.find(bookmark => bookmark.id  === this.selectedBokkmarkId);
      // @ts-ignore
       // const Filter = JSON.parse(selectedBookmark.filter);
        this.selected.emit(selectedBookmark.filter);

    }
    updateBookmark() {}

    showNewBookmarkModel() {}

    ngOnInit () {
        this.loadBookmarks(null);
    }

    ngOnDestroy () {
        this.subscriptions.unsubscribe();
    }

}
