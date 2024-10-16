import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsSendCustomNotificationModalComponent } from './hosts-send-custom-notification-modal.component';

describe('HostsSendCustomNotificationModalComponent', () => {
    let component: HostsSendCustomNotificationModalComponent;
    let fixture: ComponentFixture<HostsSendCustomNotificationModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostsSendCustomNotificationModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostsSendCustomNotificationModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
