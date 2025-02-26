import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoreportAvailibilityColorsComponent } from './autoreport-availibility-colors.component';

describe('AutoreportAvailibilityColorsComponent', () => {
  let component: AutoreportAvailibilityColorsComponent;
  let fixture: ComponentFixture<AutoreportAvailibilityColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoreportAvailibilityColorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoreportAvailibilityColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
