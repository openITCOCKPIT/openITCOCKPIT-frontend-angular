import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarsIndexComponent } from './calendars-index.component';

describe('CalendarsIndexComponent', () => {
  let component: CalendarsIndexComponent;
  let fixture: ComponentFixture<CalendarsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarsIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
