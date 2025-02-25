import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficlightWidgetComponent } from './trafficlight-widget.component';

describe('TrafficlightWidgetComponent', () => {
  let component: TrafficlightWidgetComponent;
  let fixture: ComponentFixture<TrafficlightWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrafficlightWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficlightWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
