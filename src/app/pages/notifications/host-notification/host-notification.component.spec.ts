import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostNotificationComponent } from './host-notification.component';

describe('HostNotificationComponent', () => {
    let component: HostNotificationComponent;
    let fixture: ComponentFixture<HostNotificationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HostNotificationComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HostNotificationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
