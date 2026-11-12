import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvesTrendChartComponent } from './cves-trend-chart.component';

describe('CvesTrendChartComponent', () => {
    let component: CvesTrendChartComponent;
    let fixture: ComponentFixture<CvesTrendChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CvesTrendChartComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CvesTrendChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
