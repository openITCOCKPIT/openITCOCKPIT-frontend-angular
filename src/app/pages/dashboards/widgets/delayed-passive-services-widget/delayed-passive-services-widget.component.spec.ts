import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayedPassiveServicesWidgetComponent } from './delayed-passive-services-widget.component';

describe('DelayedPassiveServicesWidgetComponent', () => {
    let component: DelayedPassiveServicesWidgetComponent;
    let fixture: ComponentFixture<DelayedPassiveServicesWidgetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DelayedPassiveServicesWidgetComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DelayedPassiveServicesWidgetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
