import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicegroupsExtendedComponent } from './servicegroups-extended.component';

describe('ServicegroupsExtendedComponent', () => {
    let component: ServicegroupsExtendedComponent;
    let fixture: ComponentFixture<ServicegroupsExtendedComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicegroupsExtendedComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServicegroupsExtendedComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
