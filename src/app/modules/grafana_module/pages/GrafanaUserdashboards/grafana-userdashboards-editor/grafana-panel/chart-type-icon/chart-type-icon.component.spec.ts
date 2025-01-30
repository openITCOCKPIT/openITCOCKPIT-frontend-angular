import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartTypeIconComponent } from './chart-type-icon.component';

describe('ChartTypeIconComponent', () => {
  let component: ChartTypeIconComponent;
  let fixture: ComponentFixture<ChartTypeIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartTypeIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartTypeIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
