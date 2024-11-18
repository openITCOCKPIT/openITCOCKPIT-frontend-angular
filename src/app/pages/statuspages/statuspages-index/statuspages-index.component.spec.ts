import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatuspagesIndexComponent } from './statuspages-index.component';

describe('StatuspagesIndexComponent', () => {
  let component: StatuspagesIndexComponent;
  let fixture: ComponentFixture<StatuspagesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatuspagesIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatuspagesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
