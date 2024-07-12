import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartLoaderComponent } from './chart-loader.component';

describe('ChartLoaderComponent', () => {
  let component: ChartLoaderComponent;
  let fixture: ComponentFixture<ChartLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
