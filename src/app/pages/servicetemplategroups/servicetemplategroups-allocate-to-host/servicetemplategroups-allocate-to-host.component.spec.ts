import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetemplategroupsAllocateToHostComponent } from './servicetemplategroups-allocate-to-host.component';

describe('ServicetemplategroupsAllocateToHostComponent', () => {
    let component: ServicetemplategroupsAllocateToHostComponent;
    let fixture: ComponentFixture<ServicetemplategroupsAllocateToHostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicetemplategroupsAllocateToHostComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServicetemplategroupsAllocateToHostComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
