import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangecalendarsCalendarComponent } from './changecalendars-calendar.component';

describe('ChangecalendarsCalendarComponent', () => {
  let component: ChangecalendarsCalendarComponent;
  let fixture: ComponentFixture<ChangecalendarsCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangecalendarsCalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangecalendarsCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
