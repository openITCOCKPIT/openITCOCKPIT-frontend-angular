import { TrueFalseDirective } from './true-false.directive';
import { ElementRef, Renderer2 } from '@angular/core';

describe('TrueFalseDirective', () => {
    let directive: TrueFalseDirective;
    let elementRef: ElementRef;
    let renderer: Renderer2;
    let mockElement: any;
    let mockRenderer: any;

    beforeEach(() => {
        mockElement = {nativeElement: {checked: false}};
        mockRenderer = {setProperty: jasmine.createSpy('setProperty')};
        elementRef = new ElementRef(mockElement);
        renderer = new Renderer2(mockRenderer);
        directive = new TrueFalseDirective(elementRef, renderer);
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    it('should propagate true value on host change', () => {
        directive.trueValue = 'yes';
        directive.falseValue = 'no';
        directive.registerOnChange(value => {
            expect(value).toBe('yes');
        });
        directive.onHostChange({target: {checked: true}});
    });

    it('should propagate false value on host change', () => {
        directive.trueValue = 'yes';
        directive.falseValue = 'no';
        directive.registerOnChange(value => {
            expect(value).toBe('no');
        });
        directive.onHostChange({target: {checked: false}});
    });

    it('should write true value to view', () => {
        directive.trueValue = 'yes';
        directive.falseValue = 'no';
        directive.writeValue('yes');
        expect(mockRenderer.setProperty).toHaveBeenCalledWith(mockElement.nativeElement, 'checked', true);
    });

    it('should write false value to view', () => {
        directive.trueValue = 'yes';
        directive.falseValue = 'no';
        directive.writeValue('no');
        expect(mockRenderer.setProperty).toHaveBeenCalledWith(mockElement.nativeElement, 'checked', false);
    });
});
