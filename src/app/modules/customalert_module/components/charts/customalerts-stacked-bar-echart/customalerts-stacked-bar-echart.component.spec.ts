import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomalertsStackedBarEchartComponent } from './customalerts-stacked-bar-echart.component';

describe('CustomalertsStackedBarEchartComponent', () => {
    let component: CustomalertsStackedBarEchartComponent;
    let fixture: ComponentFixture<CustomalertsStackedBarEchartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CustomalertsStackedBarEchartComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            CustomalertsStackedBarEchartComponent,
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
