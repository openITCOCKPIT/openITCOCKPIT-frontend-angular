import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcomProxyComponent } from './broadcom-proxy.component';

describe('BroadcomProxyComponent', () => {
  let component: BroadcomProxyComponent;
  let fixture: ComponentFixture<BroadcomProxyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BroadcomProxyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BroadcomProxyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
