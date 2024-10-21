import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesotdEditComponent } from './messagesotd-edit.component';

describe('MessagesotdEditComponent', () => {
  let component: MessagesotdEditComponent;
  let fixture: ComponentFixture<MessagesotdEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesotdEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesotdEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
