import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrometheusExportersIndexComponent } from './prometheus-exporters-index.component';

describe('PrometheusexportersIndexComponent', () => {
    let component: PrometheusExportersIndexComponent;
    let fixture: ComponentFixture<PrometheusExportersIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PrometheusExportersIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PrometheusExportersIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
