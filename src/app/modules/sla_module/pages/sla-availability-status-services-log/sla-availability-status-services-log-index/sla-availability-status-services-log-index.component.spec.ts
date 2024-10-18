import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaAvailabilityStatusServicesLogIndexComponent } from './sla-availability-status-services-log-index.component';

describe('SlaAvailabilityStatusServicesLogIndexComponent', () => {
    let component: SlaAvailabilityStatusServicesLogIndexComponent;
    let fixture: ComponentFixture<SlaAvailabilityStatusServicesLogIndexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlaAvailabilityStatusServicesLogIndexComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SlaAvailabilityStatusServicesLogIndexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
