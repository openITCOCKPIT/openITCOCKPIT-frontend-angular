import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostPieChartComponent } from './host-pie-chart.component';

describe('HostPieChartComponent', () => {
    let component: HostPieChartComponent;
    let fixture: ComponentFixture<HostPieChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostPieChartComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostPieChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
