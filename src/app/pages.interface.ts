import { PaginatorChangeEvent } from './layouts/coreui/paginator/paginator.interface';
import { Sort } from '@angular/material/sort';

export declare interface IndexPage {

    /**
     * @description
     * Method to show or hide the filter container
     */
    toggleFilter(): void;

    /**
     * @description
     * Will reset the filter back to the default state
     */
    resetFilter(): void;

    /**
     * @description
     * Callback method of the paginator which gets called when the paginator changes
     *
     * @param change PaginatorChangeEvent
     */
    onPaginatorChange(change: PaginatorChangeEvent): void;

    /**
     * @description
     * Callback when a filter has changed
     *
     * @param event
     */
    onFilterChange(event: Event): void;

    /**
     * @description
     * Callback when the sort of column has changed
     *
     * @param sort Sort
     */
    onSortChange(sort: Sort): void;

    /**
     * @description
     * Generic callback whenever a mass action (like delete all) has been finished
     *
     * @param success
     */
    onMassActionComplete(success: boolean): void;
}
