import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesotdIndexComponent } from './messagesotd-index.component';

describe('MessagesotdIndexComponent', () => {
  let component: MessagesotdIndexComponent;
  let fixture: ComponentFixture<MessagesotdIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesotdIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesotdIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
