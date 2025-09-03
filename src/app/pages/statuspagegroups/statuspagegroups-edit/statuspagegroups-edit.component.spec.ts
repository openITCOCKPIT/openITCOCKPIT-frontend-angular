import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuspagegroupsEditComponent } from './statuspagegroups-edit.component';

describe('StatuspagegroupsEditComponent', () => {
  let component: StatuspagegroupsEditComponent;
  let fixture: ComponentFixture<StatuspagegroupsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatuspagegroupsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatuspagegroupsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
