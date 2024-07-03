import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHostdowntimeComponent } from './add-hostdowntime.component';

describe('AddHostdowntimeComponent', () => {
  let component: AddHostdowntimeComponent;
  let fixture: ComponentFixture<AddHostdowntimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHostdowntimeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHostdowntimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
