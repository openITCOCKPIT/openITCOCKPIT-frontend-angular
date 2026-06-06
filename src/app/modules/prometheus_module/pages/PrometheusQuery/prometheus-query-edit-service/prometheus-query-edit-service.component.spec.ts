import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrometheusQueryEditServiceComponent } from './prometheus-query-edit-service.component';

describe('PrometheusQueryEditServiceComponent', () => {
    let component: PrometheusQueryEditServiceComponent;
    let fixture: ComponentFixture<PrometheusQueryEditServiceComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PrometheusQueryEditServiceComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PrometheusQueryEditServiceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
