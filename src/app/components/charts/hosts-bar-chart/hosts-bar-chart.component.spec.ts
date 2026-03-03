import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsBarChartComponent } from './hosts-bar-chart.component';

describe('HostsBarChartComponent', () => {
    let component: HostsBarChartComponent;
    let fixture: ComponentFixture<HostsBarChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostsBarChartComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostsBarChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
