import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarsAddComponent } from './calendars-add.component';

describe('CalendarsAddComponent', () => {
  let component: CalendarsAddComponent;
  let fixture: ComponentFixture<CalendarsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarsAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
