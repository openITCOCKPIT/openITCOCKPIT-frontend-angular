import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatorComponent } from '../paginator/paginator.component';
import { ScrollIndexComponent } from '../scroll-index/scroll-index.component';
import { PaginateOrScroll, PaginatorChangeEvent } from '../paginator.interface';

import { ColComponent, RowComponent } from '@coreui/angular';
import { XsButtonDirective } from '../../xsbutton-directive/xsbutton.directive';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
    selector: 'oitc-paginate-or-scroll',
    imports: [
        PaginatorComponent,
        ScrollIndexComponent,
        RowComponent,
        ColComponent,
        XsButtonDirective,
        TranslocoDirective
    ],
    templateUrl: './paginate-or-scroll.component.html',
    styleUrl: './paginate-or-scroll.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginateOrScrollComponent {

    @Input() paginateOrScroll?: PaginateOrScroll;
    @Output() paginatorChange = new EventEmitter<PaginatorChangeEvent>();

    public isScrollMode: boolean = true;
    private currentPage: number = 1;

    // Pass change page event from Paginator or Scroll Index Component
    public onPageChange(newPage: number): void {
        this.currentPage = newPage;
        this.paginatorChange.emit({
            page: newPage,
            scroll: this.isScrollMode
        });
    }

    public changeMode(): void {
        this.isScrollMode = !this.isScrollMode;
        if (this.paginateOrScroll?.paging) {
            this.currentPage = this.paginateOrScroll.paging.page;
        }
        if (this.paginateOrScroll?.scroll) {
            this.currentPage = this.paginateOrScroll.scroll.page;
        }
        this.paginatorChange.emit({
            page: this.currentPage,
            scroll: this.isScrollMode
        });
    }

}
