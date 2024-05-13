import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DowntimeTooltipComponent } from './downtime-tooltip.component';

describe('DowntimeTooltipComponent', () => {
  let component: DowntimeTooltipComponent;
  let fixture: ComponentFixture<DowntimeTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DowntimeTooltipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DowntimeTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
