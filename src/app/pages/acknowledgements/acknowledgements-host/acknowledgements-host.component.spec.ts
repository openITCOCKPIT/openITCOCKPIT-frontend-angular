import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgementsHostComponent } from './acknowledgements-host.component';

describe('AcknowledgementsHostComponent', () => {
  let component: AcknowledgementsHostComponent;
  let fixture: ComponentFixture<AcknowledgementsHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcknowledgementsHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcknowledgementsHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
