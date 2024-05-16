import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";

@Directive({
    selector: '[oitcDebounce]',
    standalone: true
})
export class DebounceDirective {

    @Input() debounceTime = 500;
    @Output() debouncedValue = new EventEmitter<any>();
    private subject = new Subject<any>();

    private counter = 0;

    constructor(private elementRef: ElementRef) {
        this.subject.pipe(
            debounceTime(this.debounceTime),
            distinctUntilChanged()
        ).subscribe(value => {
            this.debouncedValue.emit(value);
        });
    }

    // Input type=text uses the input event
    @HostListener('input', ['$event.target.value'])
    onInputChange(value: any): void {
        // Ignore checkboxes
        if (this.elementRef.nativeElement.type !== 'checkbox') {
            this.subject.next(value);
        }
    }

    // A checkbox uses the change event
    // BUT! An input type=text fires also a change event on focus left, so we have to filter this
    @HostListener('change', ['$event'])
    onInputChangeCeckbox(event: any): void {
        // For now, only listen to checkboxes
        if (this.elementRef.nativeElement.tagName === 'NG-SELECT') {
            // Not the value of the select box - but who cares
            // Just use the data from ngModel

            // The counter is just that we can push different data to the subject
            // Otherwise the distinctUntilChanged would filter it out
            this.counter++;
            this.subject.next(this.counter);
            return;
        }

        if (this.elementRef.nativeElement.type === 'checkbox') {
            let value = event.target.checked;
            this.subject.next(value);
        }
    }
}
