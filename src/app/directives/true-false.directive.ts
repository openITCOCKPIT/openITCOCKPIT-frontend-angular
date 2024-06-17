import { Directive, ElementRef, forwardRef, HostListener, Input, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR } from "@angular/forms";

@Directive({
    standalone: true,
    selector: 'input[type=checkbox][trueFalseValue]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TrueFalseDirective),
            multi: true
        }
    ]
})
export class TrueFalseDirective {

    // Many thanks to
    // https://egghead.io/lessons/angular-create-a-custom-form-control-using-angular-s-controlvalueaccessor

    // Tthe ControlValueAccessor interface to create a bridge between Angular's forms API and a native element in the DOM.

    @Input() trueValue: any = true;
    @Input() falseValue: any = false;
    @Input() disabled: boolean = false;


    constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    }

    // The @HostListener decorator is used to declare a DOM event to listen for and provide a handler method to run when that event occurs.
    @HostListener('change', ['$event'])
    onHostChange(ev: any) {
        this.propagateChange(ev.target.checked ? this.trueValue : this.falseValue);
    }

    // The writeValue, registerOnChange, and registerOnTouched methods are part of the ControlValueAccessor interface and are used to interact with the form control.
    public writeValue(obj: any): void {
        // This function sync the model value with the view
        if (obj === this.trueValue) {
            this.renderer.setProperty(this.elementRef.nativeElement, 'checked', true);
        } else {
            this.renderer.setProperty(this.elementRef.nativeElement, 'checked', false);
        }
    }

    public registerOnChange(fn: any): void {
        // This syncs the value from the view with the model
        this.propagateChange = fn;
    }

    public registerOnTouched(fn: any): void {
    }

    // The setDisabledState method is optional and can be used to react when the form control is enabled or disabled.
    public setDisabledState?(isDisabled: boolean): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
    }

    // The propagateChange method is a custom method used to update the form control's value.
    private propagateChange = (_: any) => {
    };

}
