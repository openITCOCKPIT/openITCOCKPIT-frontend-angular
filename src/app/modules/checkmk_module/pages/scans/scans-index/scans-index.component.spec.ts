import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScansIndexComponent } from './scans-index.component';

describe('ScansIndexComponent', () => {
  let component: ScansIndexComponent;
  let fixture: ComponentFixture<ScansIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScansIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScansIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
