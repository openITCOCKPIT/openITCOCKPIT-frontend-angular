import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomalertsWidgetComponent } from './customalerts-widget.component';

describe('CustomalertsWidgetComponent', () => {
    let component: CustomalertsWidgetComponent;
    let fixture: ComponentFixture<CustomalertsWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomalertsWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CustomalertsWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
