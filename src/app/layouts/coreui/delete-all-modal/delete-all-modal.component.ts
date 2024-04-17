import { Component, Inject, inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ButtonCloseDirective,
  ButtonDirective,
  ColComponent,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalService,
  ModalTitleDirective,
  ProgressComponent,
  RowComponent
} from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { DeleteAllItem } from './delete-all.interface';
import { NgForOf } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DELETE_SERVICE_TOKEN } from '../../../tokens/delete-injection.token';

@Component({
  selector: 'oitc-delete-all-modal',
  standalone: true,
  imports: [
    ModalComponent,
    ModalHeaderComponent,
    ModalBodyComponent,
    ModalTitleDirective,
    ButtonCloseDirective,
    ModalFooterComponent,
    ButtonDirective,
    TranslocoDirective,
    RowComponent,
    ColComponent,
    NgForOf,
    FaIconComponent,
    ProgressComponent
  ],
  templateUrl: './delete-all-modal.component.html',
  styleUrl: './delete-all-modal.component.css'
})
export class DeleteAllModalComponent implements OnInit, OnDestroy {

  @Input() public deleteUrl: string = '';
  @Input() public items: DeleteAllItem[] = [];

  public isDeleting: boolean = false;
  public progress: number = 0;

  private readonly modalService = inject(ModalService);
  private subscriptions: Subscription = new Subscription();

  constructor(@Inject(DELETE_SERVICE_TOKEN) private deleteService: any) {
  }

  @ViewChild('modal') private modal!: ModalComponent;

  ngOnInit() {
    this.subscriptions.add(this.modalService.modalState$.subscribe((state) => {
      //console.log(state);
    }));
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public hideModal() {
    this.modalService.toggle({
      show: false,
      id: 'deleteAllModal'
    });
  }

  public delete() {
    this.isDeleting = true;
    this.progress = 0;

    for (let i in this.items) {
      const item = this.items[i];

      this.deleteService.delete(item).subscribe({
        next(value: any) {
          console.log('Observable emitted the next value: ' + value);
        },
        error(err: any) {
          console.error('Observable emitted an error: ' + err);
        },
        complete() {
          console.log('Observable emitted the complete notification');
        }
      });

    }

  }
}
