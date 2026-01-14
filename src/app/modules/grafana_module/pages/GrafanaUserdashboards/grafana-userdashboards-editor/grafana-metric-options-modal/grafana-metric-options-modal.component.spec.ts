import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrafanaMetricOptionsModalComponent } from './grafana-metric-options-modal.component';

describe('GrafanaMetricOptionsModalComponent', () => {
    let component: GrafanaMetricOptionsModalComponent;
    let fixture: ComponentFixture<GrafanaMetricOptionsModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GrafanaMetricOptionsModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(GrafanaMetricOptionsModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
