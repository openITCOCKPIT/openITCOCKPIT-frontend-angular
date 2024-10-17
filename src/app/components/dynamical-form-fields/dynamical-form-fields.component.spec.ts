import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicalFormFieldsComponent } from './dynamical-form-fields.component';

describe('DynamicalFormFieldsComponent', () => {
    let component: DynamicalFormFieldsComponent;
    let fixture: ComponentFixture<DynamicalFormFieldsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DynamicalFormFieldsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DynamicalFormFieldsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
