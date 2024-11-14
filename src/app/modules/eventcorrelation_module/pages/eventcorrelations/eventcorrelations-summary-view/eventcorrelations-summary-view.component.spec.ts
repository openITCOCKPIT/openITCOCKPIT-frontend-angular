import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventcorrelationsSummaryViewComponent } from './eventcorrelations-summary-view.component';

describe('EventcorrelationsSummaryViewComponent', () => {
  let component: EventcorrelationsSummaryViewComponent;
  let fixture: ComponentFixture<EventcorrelationsSummaryViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventcorrelationsSummaryViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventcorrelationsSummaryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
