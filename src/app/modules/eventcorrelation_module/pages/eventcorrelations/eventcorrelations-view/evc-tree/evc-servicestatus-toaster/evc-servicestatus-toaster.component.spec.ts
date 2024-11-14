import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvcServicestatusToasterComponent } from './evc-servicestatus-toaster.component';

describe('EvcServicestatusToasterComponent', () => {
  let component: EvcServicestatusToasterComponent;
  let fixture: ComponentFixture<EvcServicestatusToasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvcServicestatusToasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvcServicestatusToasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
