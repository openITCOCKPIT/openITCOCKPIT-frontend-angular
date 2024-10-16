import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsDisableNotificationsModalComponent } from './hosts-disable-notifications-modal.component';

describe('HostsMaintenanceModalComponent', () => {
    let component: HostsDisableNotificationsModalComponent;
    let fixture: ComponentFixture<HostsDisableNotificationsModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostsDisableNotificationsModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostsDisableNotificationsModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
