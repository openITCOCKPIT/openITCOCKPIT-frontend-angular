import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgementsServiceComponent } from './acknowledgements-service.component';

describe('AcknowledgementsServiceComponent', () => {
  let component: AcknowledgementsServiceComponent;
  let fixture: ComponentFixture<AcknowledgementsServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcknowledgementsServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcknowledgementsServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
