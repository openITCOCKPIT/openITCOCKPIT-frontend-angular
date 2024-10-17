import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormWarningComponent } from './form-warning.component';

describe('FormWarningComponent', () => {
    let component: FormWarningComponent;
    let fixture: ComponentFixture<FormWarningComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormWarningComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FormWarningComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
