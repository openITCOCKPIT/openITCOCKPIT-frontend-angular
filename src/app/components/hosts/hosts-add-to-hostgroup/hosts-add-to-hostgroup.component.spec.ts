import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsAddToHostgroupComponent } from './hosts-add-to-hostgroup.component';

describe('HostsAddToHostgroupComponent', () => {
    let component: HostsAddToHostgroupComponent;
    let fixture: ComponentFixture<HostsAddToHostgroupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostsAddToHostgroupComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostsAddToHostgroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
