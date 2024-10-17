import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicestatusSimpleIconComponent } from './servicestatus-simple-icon.component';

describe('ServicestatusIconComponent', () => {
    let component: ServicestatusSimpleIconComponent;
    let fixture: ComponentFixture<ServicestatusSimpleIconComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicestatusSimpleIconComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServicestatusSimpleIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
