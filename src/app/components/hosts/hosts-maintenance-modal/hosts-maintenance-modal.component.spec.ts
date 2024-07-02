import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsMaintenanceModalComponent } from './hosts-maintenance-modal.component';

describe('HostsMaintenanceModalComponent', () => {
  let component: HostsMaintenanceModalComponent;
  let fixture: ComponentFixture<HostsMaintenanceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostsMaintenanceModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HostsMaintenanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
