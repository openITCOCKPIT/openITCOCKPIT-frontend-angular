import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationReasonTypeComponent } from './notification-reason-type.component';

describe('NotificationReasonTypeComponent', () => {
    let component: NotificationReasonTypeComponent;
    let fixture: ComponentFixture<NotificationReasonTypeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NotificationReasonTypeComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(NotificationReasonTypeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
