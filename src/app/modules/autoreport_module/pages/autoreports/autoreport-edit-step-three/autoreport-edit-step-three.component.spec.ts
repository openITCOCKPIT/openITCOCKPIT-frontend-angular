import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoreportEditStepThreeComponent } from './autoreport-edit-step-three.component';

describe('AutoreportEditStepThreeComponent', () => {
  let component: AutoreportEditStepThreeComponent;
  let fixture: ComponentFixture<AutoreportEditStepThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoreportEditStepThreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoreportEditStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
