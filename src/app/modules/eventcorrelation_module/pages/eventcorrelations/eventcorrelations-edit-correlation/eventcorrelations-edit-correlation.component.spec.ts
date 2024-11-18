import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventcorrelationsEditCorrelationComponent } from './eventcorrelations-edit-correlation.component';

describe('EventcorrelationsEditCorrelationComponent', () => {
  let component: EventcorrelationsEditCorrelationComponent;
  let fixture: ComponentFixture<EventcorrelationsEditCorrelationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventcorrelationsEditCorrelationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventcorrelationsEditCorrelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
