import {Component, inject, EventEmitter, Output, ViewChild, OnInit, OnDestroy, Input} from '@angular/core';
import {TranslocoDirective, TranslocoService} from '@jsverse/transloco';
import { NotyService } from '../../layouts/coreui/noty.service';
import {
    ButtonCloseDirective,
    ModalComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalService,
    ButtonDirective,
    ModalFooterComponent,
    ModalBodyComponent,
    RowComponent, FormControlDirective,
} from '@coreui/angular';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {FormsModule} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import {Subscription} from 'rxjs';
import {BookmarksService} from '../filter-bookmark/bookmarks.service';
import {ServiceIndexFilter} from '../../pages/services/services.interface';
import {BookmarkPost, BookmarksObject, BookmarkResponse} from '../filter-bookmark/bookmarks.interface';
import {GenericIdResponse, GenericValidationError} from '../../generic-responses';


type NewBookmark = {
    name: string
    filter: string;
    favorite:boolean
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
        ButtonDirective,
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
export class FilterBookmarkSaveModalComponent implements OnInit, OnDestroy{
    public newBookmark :  NewBookmark = {
        name: '',
        filter: '',
        favorite: false
    };
    public error: boolean  = false;
    public errors: GenericValidationError | null = null;

    @Input({required: true}) public actionType: string = '';
    @Input({required: true}) public bookmark: BookmarksObject | null = null;
    @Input({required: true}) public plugin: string = '';
    @Input({required: false}) public controller: string = '';
    @Input({required: false}) public action: string = '';
    @Input({required: false}) public filter!: ServiceIndexFilter;
    @Output() saved = new EventEmitter<string>();
    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    @ViewChild('modal') private modal!: ModalComponent;
   // private _actionType: string = '';
    private BookmarksService: BookmarksService = inject(BookmarksService);
    public TranslocoService: TranslocoService = inject(TranslocoService);
    private readonly notyService = inject(NotyService);


    public hideModal(){
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

    ngOnInit () {
        this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
            if(state.id === 'filterBookmarkSaveModal' && state.show === true) {

               if(this.actionType === 'edit' && this.bookmark !== null) {
                   this.newBookmark.name = this.bookmark.name;
                   this.newBookmark.favorite = this.bookmark.favorite
               }
            }
        }));

    }

    ngOnDestroy () {
        this.subscriptions.unsubscribe();
    }

}
