import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";

@Directive({
  selector: '[oitcDebounce]',
  standalone: true
})
export class DebounceDirective {

  @Input() debounceTime = 300;
  @Output() debouncedValue = new EventEmitter<any>();
  private subject = new Subject<any>();

  constructor() {
    this.subject.pipe(
      debounceTime(this.debounceTime),
      distinctUntilChanged()
    ).subscribe(value => {
      this.debouncedValue.emit(value);
    });
  }

  // Input type=text uses the input event
  // A checkbox uses the change event
  @HostListener('input', ['$event.target.value'])
  @HostListener('change', ['$event.target.checked'])
  onInputChange(value: any): void {
    this.subject.next(value);
  }

}
