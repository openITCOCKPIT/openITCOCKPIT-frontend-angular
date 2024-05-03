import {Component, Input} from '@angular/core';
import {
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent
} from '@coreui/angular';
import {TranslocoDirective} from '@jsverse/transloco';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {FilterBookmarkComponent} from '../filter-bookmark/filter-bookmark.component';
import {NgIf} from '@angular/common';

@Component({
    selector: 'oitc-services-index-filter',
    standalone: true,
    imports: [
        CardComponent,
        CardHeaderComponent,
        CardBodyComponent,
        TranslocoDirective,
        FaIconComponent,
        FilterBookmarkComponent,
        NgIf
    ],
    templateUrl: './services-index-filter.component.html',
    styleUrl: './services-index-filter.component.css'
})
export class ServicesIndexFilterComponent {
    @Input() set filter (filter: boolean) {
        this.showFilter = filter;
    }
    public showFilter: boolean = false;
}
