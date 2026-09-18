import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceSummaryEchartComponent } from './service-summary-echart.component';

describe('ServiceSummaryEchartComponent', () => {
    let component: ServiceSummaryEchartComponent;
    let fixture: ComponentFixture<ServiceSummaryEchartComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServiceSummaryEchartComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServiceSummaryEchartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});