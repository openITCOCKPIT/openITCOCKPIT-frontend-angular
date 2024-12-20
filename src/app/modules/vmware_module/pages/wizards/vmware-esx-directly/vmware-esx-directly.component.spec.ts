import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmwareEsxDirectlyComponent } from './vmware-esx-directly.component';

describe('VmwareEsxDirectlyComponent', () => {
  let component: VmwareEsxDirectlyComponent;
  let fixture: ComponentFixture<VmwareEsxDirectlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VmwareEsxDirectlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VmwareEsxDirectlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
