import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuspagegroupsAddComponent } from './statuspagegroups-add.component';

describe('StatuspagegroupsAddComponent', () => {
  let component: StatuspagegroupsAddComponent;
  let fixture: ComponentFixture<StatuspagegroupsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatuspagegroupsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatuspagegroupsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
