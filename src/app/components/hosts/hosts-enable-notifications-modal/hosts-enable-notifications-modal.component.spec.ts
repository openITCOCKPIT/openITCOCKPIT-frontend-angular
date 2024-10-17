import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsEnableNotificationsModalComponent } from './hosts-enable-notifications-modal.component';

describe('HostsMaintenanceModalComponent', () => {
    let component: HostsEnableNotificationsModalComponent;
    let fixture: ComponentFixture<HostsEnableNotificationsModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostsEnableNotificationsModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostsEnableNotificationsModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
