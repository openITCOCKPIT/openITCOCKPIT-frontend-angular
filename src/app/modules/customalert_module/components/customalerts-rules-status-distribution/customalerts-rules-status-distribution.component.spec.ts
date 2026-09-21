import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomalertsRulesStatusDistributionComponent } from './customalerts-rules-status-distribution.component';

describe('CustomalertsRulesStatusDistributionComponent', () => {
    let component: CustomalertsRulesStatusDistributionComponent;
    let fixture: ComponentFixture<CustomalertsRulesStatusDistributionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomalertsRulesStatusDistributionComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CustomalertsRulesStatusDistributionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
