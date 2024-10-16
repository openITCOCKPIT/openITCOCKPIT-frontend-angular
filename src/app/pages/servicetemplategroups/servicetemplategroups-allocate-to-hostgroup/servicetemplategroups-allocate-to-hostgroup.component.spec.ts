import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
    ServicetemplategroupsAllocateToHostgroupComponent
} from './servicetemplategroups-allocate-to-hostgroup.component';

describe('ServicetemplategroupsAllocateToHostgroupComponent', () => {
    let component: ServicetemplategroupsAllocateToHostgroupComponent;
    let fixture: ComponentFixture<ServicetemplategroupsAllocateToHostgroupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ServicetemplategroupsAllocateToHostgroupComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ServicetemplategroupsAllocateToHostgroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
