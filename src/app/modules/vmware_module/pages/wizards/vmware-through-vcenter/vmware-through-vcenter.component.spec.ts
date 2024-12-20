import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmwareThroughVcenterComponent } from './vmware-through-vcenter.component';

describe('VmwareThroughVcenterComponent', () => {
  let component: VmwareThroughVcenterComponent;
  let fixture: ComponentFixture<VmwareThroughVcenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VmwareThroughVcenterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VmwareThroughVcenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
