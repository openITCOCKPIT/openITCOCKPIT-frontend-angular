import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  RowComponent
} from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { Subscription } from 'rxjs';

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
    ColComponent
  ],
  templateUrl: './delete-all-modal.component.html',
  styleUrl: './delete-all-modal.component.css'
})
export class DeleteAllModalComponent implements OnInit, OnDestroy {

  private readonly modalService = inject(ModalService);
  private subscriptions: Subscription = new Subscription();

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
}
