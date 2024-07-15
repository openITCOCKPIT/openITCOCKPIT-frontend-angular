import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHostgroupdowntimeComponent } from './add-hostgroupdowntime.component';

describe('AddHostgroupdowntimeComponent', () => {
  let component: AddHostgroupdowntimeComponent;
  let fixture: ComponentFixture<AddHostgroupdowntimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHostgroupdowntimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHostgroupdowntimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
