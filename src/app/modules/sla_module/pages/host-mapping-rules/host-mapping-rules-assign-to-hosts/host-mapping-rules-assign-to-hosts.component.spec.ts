import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostMappingRulesAssignToHostsComponent } from './host-mapping-rules-assign-to-hosts.component';

describe('HostMappingRulesAssignToHostsComponent', () => {
    let component: HostMappingRulesAssignToHostsComponent;
    let fixture: ComponentFixture<HostMappingRulesAssignToHostsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostMappingRulesAssignToHostsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostMappingRulesAssignToHostsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
