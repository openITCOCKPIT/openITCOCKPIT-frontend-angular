import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HpserverhardwareComponent } from './hpserverhardware.component';

describe('HpserverhardwareComponent', () => {
  let component: HpserverhardwareComponent;
  let fixture: ComponentFixture<HpserverhardwareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HpserverhardwareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HpserverhardwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
