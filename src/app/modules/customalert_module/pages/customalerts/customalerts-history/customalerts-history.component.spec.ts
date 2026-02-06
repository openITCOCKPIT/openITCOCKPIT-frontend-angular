import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomalertsHistoryComponent } from './customalerts-history.component';

describe('CustomalertsHistoryComponent', () => {
    let component: CustomalertsHistoryComponent;
    let fixture: ComponentFixture<CustomalertsHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomalertsHistoryComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CustomalertsHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
