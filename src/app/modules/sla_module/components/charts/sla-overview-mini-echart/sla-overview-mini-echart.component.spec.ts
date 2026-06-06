import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaOverviewMiniEchartComponent } from './sla-overview-mini-echart.component';

describe('SlaOverviewMiniEchartComponent', () => {
    let component: SlaOverviewMiniEchartComponent;
    let fixture: ComponentFixture<SlaOverviewMiniEchartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlaOverviewMiniEchartComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SlaOverviewMiniEchartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
