import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsEnableFlapdetectionModalComponent } from './hosts-enable-flapdetection-modal.component';

describe('HostsEnableFlapdetectionModalComponent', () => {
  let component: HostsEnableFlapdetectionModalComponent;
  let fixture: ComponentFixture<HostsEnableFlapdetectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostsEnableFlapdetectionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostsEnableFlapdetectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
