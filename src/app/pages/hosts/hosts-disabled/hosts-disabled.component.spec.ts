import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsDisabledComponent } from './hosts-disabled.component';

describe('HostsDisabledComponent', () => {
  let component: HostsDisabledComponent;
  let fixture: ComponentFixture<HostsDisabledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostsDisabledComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HostsDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
