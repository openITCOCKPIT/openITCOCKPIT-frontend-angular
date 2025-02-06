import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoreportAddStepOneComponent } from './autoreport-add-step-one.component';

describe('AutoreportAddStepOneComponent', () => {
  let component: AutoreportAddStepOneComponent;
  let fixture: ComponentFixture<AutoreportAddStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoreportAddStepOneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoreportAddStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
