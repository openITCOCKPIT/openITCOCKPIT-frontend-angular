import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCumulatedStatusIconComponent } from './service-cumulated-status-icon.component';

describe('ServiceCumulatedStatusIconComponent', () => {
    let component: ServiceCumulatedStatusIconComponent;
    let fixture: ComponentFixture<ServiceCumulatedStatusIconComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServiceCumulatedStatusIconComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServiceCumulatedStatusIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
