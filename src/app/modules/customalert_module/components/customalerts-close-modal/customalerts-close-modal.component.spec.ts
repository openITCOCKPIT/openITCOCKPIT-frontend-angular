import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomalertsCloseModalComponent } from './customalerts-close-modal.component';

describe('CustomalertsCloseModalComponent', () => {
    let component: CustomalertsCloseModalComponent;
    let fixture: ComponentFixture<CustomalertsCloseModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomalertsCloseModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CustomalertsCloseModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
