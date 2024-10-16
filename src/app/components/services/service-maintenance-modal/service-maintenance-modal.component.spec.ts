import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceMaintenanceModalComponent } from './service-maintenance-modal.component';

describe('ServiceMaintenanceModalComponent', () => {
    let component: ServiceMaintenanceModalComponent;
    let fixture: ComponentFixture<ServiceMaintenanceModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServiceMaintenanceModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServiceMaintenanceModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
