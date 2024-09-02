import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualMachineComponent } from './virtual-machine.component';

describe('VirtualMachineComponent', () => {
  let component: VirtualMachineComponent;
  let fixture: ComponentFixture<VirtualMachineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualMachineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirtualMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
