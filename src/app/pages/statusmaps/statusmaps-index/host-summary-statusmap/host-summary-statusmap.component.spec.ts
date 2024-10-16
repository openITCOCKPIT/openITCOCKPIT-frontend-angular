import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostSummaryStatusmapComponent } from './host-summary-statusmap.component';

describe('HostSummaryStatusmapComponent', () => {
    let component: HostSummaryStatusmapComponent;
    let fixture: ComponentFixture<HostSummaryStatusmapComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostSummaryStatusmapComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostSummaryStatusmapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
