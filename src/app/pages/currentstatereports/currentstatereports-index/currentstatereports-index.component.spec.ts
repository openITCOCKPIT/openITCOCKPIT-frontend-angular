import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentstatereportsIndexComponent } from './currentstatereports-index.component';

describe('CurrentstatereportsIndexComponent', () => {
  let component: CurrentstatereportsIndexComponent;
  let fixture: ComponentFixture<CurrentstatereportsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentstatereportsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentstatereportsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
