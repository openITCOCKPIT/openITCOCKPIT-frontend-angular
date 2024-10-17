import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicestatusIconAutomapComponent } from './servicestatus-icon-automap.component';

describe('ServicestatusIconAutomapComponent', () => {
    let component: ServicestatusIconAutomapComponent;
    let fixture: ComponentFixture<ServicestatusIconAutomapComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicestatusIconAutomapComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServicestatusIconAutomapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
