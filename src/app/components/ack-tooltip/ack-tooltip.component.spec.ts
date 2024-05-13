import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AckTooltipComponent } from './ack-tooltip.component';

describe('AckTooltipComponent', () => {
  let component: AckTooltipComponent;
  let fixture: ComponentFixture<AckTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AckTooltipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AckTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
