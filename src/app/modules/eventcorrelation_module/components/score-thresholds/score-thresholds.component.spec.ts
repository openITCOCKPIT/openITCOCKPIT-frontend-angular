import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreThresholdsComponent } from './score-thresholds.component';

describe('ScoreThresholdsComponent', () => {
  let component: ScoreThresholdsComponent;
  let fixture: ComponentFixture<ScoreThresholdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreThresholdsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreThresholdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
