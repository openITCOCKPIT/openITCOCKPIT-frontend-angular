import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostSummaryEchartComponent } from './host-summary-echart.component';

describe('HostSummaryEchartComponent', () => {
    let component: HostSummaryEchartComponent;
    let fixture: ComponentFixture<HostSummaryEchartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostSummaryEchartComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostSummaryEchartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});