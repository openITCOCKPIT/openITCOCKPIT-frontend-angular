import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomalertsAnnotateModalComponent } from './customalerts-annotate-modal.component';

describe('CustomalertsAnnotateModalComponent', () => {
    let component: CustomalertsAnnotateModalComponent;
    let fixture: ComponentFixture<CustomalertsAnnotateModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomalertsAnnotateModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CustomalertsAnnotateModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
