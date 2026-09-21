import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomalertsRulesHistoryComponent } from './customalerts-rules-history.component';

describe('CustomalertsRulesHistoryComponent', () => {
    let component: CustomalertsRulesHistoryComponent;
    let fixture: ComponentFixture<CustomalertsRulesHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomalertsRulesHistoryComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CustomalertsRulesHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
