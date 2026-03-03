import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomalertsIndexComponent } from './customalerts-index.component';

describe('CustomalertsIndexComponent', () => {
    let component: CustomalertsIndexComponent;
    let fixture: ComponentFixture<CustomalertsIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomalertsIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CustomalertsIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
