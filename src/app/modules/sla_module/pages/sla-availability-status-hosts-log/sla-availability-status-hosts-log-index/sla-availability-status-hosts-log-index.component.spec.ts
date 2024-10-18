import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaAvailabilityStatusHostsLogIndexComponent } from './sla-availability-status-hosts-log-index.component';

describe('SlaAvailabilityStatusHostsLogIndexComponent', () => {
    let component: SlaAvailabilityStatusHostsLogIndexComponent;
    let fixture: ComponentFixture<SlaAvailabilityStatusHostsLogIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlaAvailabilityStatusHostsLogIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SlaAvailabilityStatusHostsLogIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
