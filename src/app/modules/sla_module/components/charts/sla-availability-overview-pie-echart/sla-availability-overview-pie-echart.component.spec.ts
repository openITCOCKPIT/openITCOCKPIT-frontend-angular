import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaAvailabilityOverviewPieEchartComponent } from './sla-availability-overview-pie-echart.component';

describe('SlaAvailabilityOverviewPieEchartComponent', () => {
    let component: SlaAvailabilityOverviewPieEchartComponent;
    let fixture: ComponentFixture<SlaAvailabilityOverviewPieEchartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlaAvailabilityOverviewPieEchartComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SlaAvailabilityOverviewPieEchartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
