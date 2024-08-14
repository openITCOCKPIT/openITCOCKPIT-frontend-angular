import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsDisableFlapdetectionModalComponent } from './hosts-disable-flapdetection-modal.component';

describe('HostsDisableFlapdetectionModalComponent', () => {
  let component: HostsDisableFlapdetectionModalComponent;
  let fixture: ComponentFixture<HostsDisableFlapdetectionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostsDisableFlapdetectionModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostsDisableFlapdetectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
