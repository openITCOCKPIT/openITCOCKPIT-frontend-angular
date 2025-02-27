import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangecalendarsEventViewerComponent } from './changecalendars-event-viewer.component';

describe('ChangecalendarsEventViewerComponent', () => {
  let component: ChangecalendarsEventViewerComponent;
  let fixture: ComponentFixture<ChangecalendarsEventViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangecalendarsEventViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangecalendarsEventViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
