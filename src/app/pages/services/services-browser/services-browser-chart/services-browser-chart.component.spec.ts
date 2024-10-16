import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesBrowserChartComponent } from './services-browser-chart.component';

describe('ServicesBrowserChartComponent', () => {
    let component: ServicesBrowserChartComponent;
    let fixture: ComponentFixture<ServicesBrowserChartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicesBrowserChartComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServicesBrowserChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
