import { DebounceDirective } from './debounce.directive';
import { ElementRef } from '@angular/core';

describe('DebounceDirective', () => {
    let directive: DebounceDirective;
    let elementRef: ElementRef;
    let mockElement: any;

    beforeEach(() => {
        mockElement = {nativeElement: {type: ''}};
        elementRef = new ElementRef(mockElement);
        directive = new DebounceDirective(elementRef);
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    it('should emit debounced value for text input', (done) => {
        directive.debounceTime = 1;
        directive.debouncedValue.subscribe(value => {
            expect(value).toBe('test');
            done();
        });
        directive.onInputChange('test');
    });

    it('should not emit debounced value for checkbox input', (done) => {
        directive.debounceTime = 1;
        directive.debouncedValue.subscribe(() => {
            fail('Should not emit value for checkbox input');
        });
        mockElement.nativeElement.type = 'checkbox';
        directive.onInputChange('test');
        setTimeout(done, 10);
    });

    it('should emit debounced value for checkbox change', (done) => {
        directive.debounceTime = 1;
        directive.debouncedValue.subscribe(value => {
            expect(value).toBe(true);
            done();
        });
        mockElement.nativeElement.type = 'checkbox';
        directive.onInputChangeCeckbox(true);
    });

    it('should not emit debounced value for text input change', (done) => {
        directive.debounceTime = 1;
        directive.debouncedValue.subscribe(() => {
            fail('Should not emit value for text input change');
        });
        mockElement.nativeElement.type = 'text';
        directive.onInputChangeCeckbox(true);
        setTimeout(done, 10);
    });
});
