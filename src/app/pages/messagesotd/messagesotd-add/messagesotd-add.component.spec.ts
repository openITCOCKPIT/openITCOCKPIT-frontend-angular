import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesotdAddComponent } from './messagesotd-add.component';

describe('MessagesotdAddComponent', () => {
    let component: MessagesotdAddComponent;
    let fixture: ComponentFixture<MessagesotdAddComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MessagesotdAddComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MessagesotdAddComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
