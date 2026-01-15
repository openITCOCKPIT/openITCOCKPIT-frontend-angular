import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrometheusThresholdsComponent } from './prometheus-thresholds.component';

describe('PrometheusThresholdsComponent', () => {
    let component: PrometheusThresholdsComponent;
    let fixture: ComponentFixture<PrometheusThresholdsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PrometheusThresholdsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PrometheusThresholdsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
