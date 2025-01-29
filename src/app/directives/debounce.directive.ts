import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { debounceTime, Subject } from "rxjs";

@Directive({
    selector: '[oitcDebounce]',
    standalone: true
})
export class DebounceDirective {

    /**
     * ITC-3422
     * The original code used DOM events to detect changes in the input field.
     * This had some own issues for checkboxes and ng-selects.
     *
     * Instead of using DOM events, we now use the ngModelChange event to detect changes
     * when the ngModel changes. All our filters and forms use ngModel, so this should work for all cases.
     *
     * How every, when clicking on "Reset Filter" the ngModelChange is STILL NOT triggered. so ITC-3422 is not resolved.
     * To resolve ITC-3422, distinctUntilChanged got removed.
     *
     * It works like so:
     * 1. Filter for "abc"
     * 2. Reset filter (ngModelChange will not trigger)
     * 3. Filter for "abc" again. (ngModelChange will trigger (instead of the classic DOM events that won't trigger in this case)) and update the state of this directive.
     * 4. The Subject will emit "abc" again due to distinctUntilChanged is removed
     *
     * Original code before ITC-3422:
     * https://github.com/it-novum/openITCOCKPIT-frontend-angular/blob/8222cb62306b4da262afd54082df396078c0873c/src/app/directives/debounce.directive.ts
     *
     */

    @Input() debounceTime = 500;
    @Output() debouncedValue = new EventEmitter<any>();
    private subject = new Subject<any>();

    constructor(private elementRef: ElementRef) {
        this.subject.pipe(
            debounceTime(this.debounceTime),
            //distinctUntilChanged()
        ).subscribe(value => {
            //console.log('emit ', value);
            this.debouncedValue.emit(value);
        });
    }

    @HostListener('ngModelChange', ['$event'])
    ngModelChange(value: any) {
        this.subject.next(value);
    }

}
