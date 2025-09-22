import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuspagegroupsIndexComponent } from './statuspagegroups-index.component';

describe('StatuspagegroupsIndexComponent', () => {
  let component: StatuspagegroupsIndexComponent;
  let fixture: ComponentFixture<StatuspagegroupsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatuspagegroupsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatuspagegroupsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
