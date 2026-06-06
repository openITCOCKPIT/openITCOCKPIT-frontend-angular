import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostSimplePieChartComponent } from './host-simple-pie-chart.component';

describe('HostSimplePieChartComponent', () => {
    let component: HostSimplePieChartComponent;
    let fixture: ComponentFixture<HostSimplePieChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostSimplePieChartComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostSimplePieChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
