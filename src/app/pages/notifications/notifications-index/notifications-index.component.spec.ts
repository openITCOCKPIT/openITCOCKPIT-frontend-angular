import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsIndexComponent } from './notifications-index.component';

describe('NotificationsIndexComponent', () => {
  let component: NotificationsIndexComponent;
  let fixture: ComponentFixture<NotificationsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
