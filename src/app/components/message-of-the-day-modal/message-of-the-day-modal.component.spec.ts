import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageOfTheDayModalComponent } from './message-of-the-day-modal.component';

describe('MessageOfTheDayModalComponent', () => {
    let component: MessageOfTheDayModalComponent;
    let fixture: ComponentFixture<MessageOfTheDayModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MessageOfTheDayModalComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MessageOfTheDayModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
