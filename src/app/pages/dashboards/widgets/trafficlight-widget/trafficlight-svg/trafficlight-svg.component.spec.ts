import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficlightSvgComponent } from './trafficlight-svg.component';

describe('TrafficlightSvgComponent', () => {
  let component: TrafficlightSvgComponent;
  let fixture: ComponentFixture<TrafficlightSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrafficlightSvgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficlightSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
