import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmwaresnapshotComponent } from './vmwaresnapshot.component';

describe('VmwaresnapshotComponent', () => {
  let component: VmwaresnapshotComponent;
  let fixture: ComponentFixture<VmwaresnapshotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VmwaresnapshotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VmwaresnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
