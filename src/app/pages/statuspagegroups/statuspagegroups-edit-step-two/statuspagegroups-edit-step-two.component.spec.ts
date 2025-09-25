import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuspagegroupsEditStepTwoComponent } from './statuspagegroups-edit-step-two.component';

describe('StatuspagegroupsEditStepTwoComponent', () => {
  let component: StatuspagegroupsEditStepTwoComponent;
  let fixture: ComponentFixture<StatuspagegroupsEditStepTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatuspagegroupsEditStepTwoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatuspagegroupsEditStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
