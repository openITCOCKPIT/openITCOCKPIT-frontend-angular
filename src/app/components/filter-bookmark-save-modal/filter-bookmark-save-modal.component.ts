import {Component, inject, EventEmitter, Output, ViewChild, OnDestroy} from '@angular/core';
import {TranslocoDirective} from '@jsverse/transloco';
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
import {NgIf} from '@angular/common';
import {Subscription} from 'rxjs';
import {BookmarksService} from '../filter-bookmark/bookmarks.service';

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
        FormControlDirective
    ],
  templateUrl: './filter-bookmark-save-modal.component.html',
  styleUrl: './filter-bookmark-save-modal.component.css'
})
export class FilterBookmarkSaveModalComponent implements OnDestroy{
    public newBookmark :  NewBookmark = {
        name: '',
        filter: '',
        favorite: false
    };
    public error: boolean  = false;
    public errorMessage = ''

    @Output() toSave = new EventEmitter<string>();
    private readonly modalService = inject(ModalService);
    private subscriptions: Subscription = new Subscription();
    @ViewChild('modal') private modal!: ModalComponent;

    public hideModal(){
        this.error = false;
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
       // this.toSave.emit(this.name);
        this.hideModal()
    }

    ngOnDestroy () {
        this.subscriptions.unsubscribe();
    }

}
