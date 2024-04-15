import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ColComponent,
  ContainerComponent,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  RowComponent
} from '@coreui/angular';
import { TranslocoDirective } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { SelectionServiceService } from './selection-service.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'oitc-select-all',
  standalone: true,
  imports: [
    ColComponent,
    ContainerComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    RowComponent,
    TranslocoDirective,
    FormsModule
  ],
  templateUrl: './select-all.component.html',
  styleUrl: './select-all.component.css'
})
export class SelectAllComponent implements OnInit, OnDestroy {

  @Input() public itemsCount: number = 0;

  public currentSelection: any[] = [];
  public checked = false;
  public intermediate = false;

  private subscriptions: Subscription = new Subscription();

  constructor(public selection: SelectionServiceService) {
  }

  public ngOnInit() {
    this.subscriptions.add(this.selection.selection$.subscribe(selection => {
      this.currentSelection = selection;

      if (this.currentSelection.length === this.itemsCount) {
        // All items are selected
        this.checked = true;
      }

      this.intermediate = false;
      if (this.currentSelection.length > 0 && this.currentSelection.length < this.itemsCount) {
        this.intermediate = true;
        this.checked = false;
      }

    }));
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public toggleSelectAll() {
    if (this.checked) {
      this.selection.selectAll();
    } else {
      this.selection.delelectAll();
    }
  }

}
