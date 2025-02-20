import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostAvailabilityOverviewComponent } from './host-availability-overview.component';

describe('HostAvailabilityOverviewComponent', () => {
    let component: HostAvailabilityOverviewComponent;
    let fixture: ComponentFixture<HostAvailabilityOverviewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostAvailabilityOverviewComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostAvailabilityOverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
