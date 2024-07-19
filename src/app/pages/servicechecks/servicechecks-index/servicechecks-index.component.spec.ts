import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicechecksIndexComponent } from './servicechecks-index.component';

describe('ServicechecksIndexComponent', () => {
  let component: ServicechecksIndexComponent;
  let fixture: ComponentFixture<ServicechecksIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicechecksIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicechecksIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
