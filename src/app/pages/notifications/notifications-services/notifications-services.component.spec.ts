import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsServicesComponent } from './notifications-services.component';

describe('NotificationsServicesComponent', () => {
    let component: NotificationsServicesComponent;
    let fixture: ComponentFixture<NotificationsServicesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NotificationsServicesComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NotificationsServicesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
