import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Scroll } from '../paginator.interface';

@Component({
  selector: 'oitc-scroll-index',
  standalone: true,
  imports: [],
  templateUrl: './scroll-index.component.html',
  styleUrl: './scroll-index.component.css'
})
export class ScrollIndexComponent {

  @Input() scroll?: Scroll;
  @Output() pageChange = new EventEmitter<number>();

  // Go to first page
  public firstPage() {
    this.pageChange.emit(1);
  }

  // Go to next page (if any)
  public nextPage() {
    if (this.scroll) {
      if (this.scroll.hasNextPage) {
        this.pageChange.emit((this.scroll.page + 1));
      }
    }
  }

  // Go to previous page (if any)
  public prevPage() {
    if (this.scroll) {
      if (this.scroll.hasPrevPage && this.scroll.page - 1 > 0) {
        this.pageChange.emit((this.scroll.page - 1));
      }
    }
  }
}
