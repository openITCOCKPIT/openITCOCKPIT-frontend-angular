import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlaHostgroupHostsStatusOverviewComponent } from './sla-hostgroup-hosts-status-overview.component';

describe('SlaHostgroupHostsStatusOverviewComponent', () => {
    let component: SlaHostgroupHostsStatusOverviewComponent;
    let fixture: ComponentFixture<SlaHostgroupHostsStatusOverviewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SlaHostgroupHostsStatusOverviewComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SlaHostgroupHostsStatusOverviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
