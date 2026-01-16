import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrometheusQueryToServiceComponent } from './prometheus-query-to-service.component';

describe('PrometheusQueryToServiceComponent', () => {
    let component: PrometheusQueryToServiceComponent;
    let fixture: ComponentFixture<PrometheusQueryToServiceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PrometheusQueryToServiceComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PrometheusQueryToServiceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
