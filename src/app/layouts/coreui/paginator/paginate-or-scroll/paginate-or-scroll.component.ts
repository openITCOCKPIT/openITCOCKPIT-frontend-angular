import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorComponent } from '../paginator/paginator.component';
import { ScrollIndexComponent } from '../scroll-index/scroll-index.component';
import { PaginateOrScroll } from '../paginator.interface';
import { NgIf } from '@angular/common';
import { RowComponent } from '@coreui/angular';

@Component({
  selector: 'oitc-paginate-or-scroll',
  standalone: true,
  imports: [
    PaginatorComponent,
    ScrollIndexComponent,
    NgIf,
    RowComponent
  ],
  templateUrl: './paginate-or-scroll.component.html',
  styleUrl: './paginate-or-scroll.component.css'
})
export class PaginateOrScrollComponent {

  @Input() paginateOrScroll?: PaginateOrScroll;
  @Output() pageChange = new EventEmitter<number>();

  // Pass change page event from Paginator or Scroll Index Component
  onPageChange(newPage: number): void {
    this.pageChange.emit(newPage);
  }

}
