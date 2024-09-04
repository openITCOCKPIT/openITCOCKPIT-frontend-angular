import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostGroupSummaryComponent } from './host-group-summary.component';

describe('HostGroupSummaryComponent', () => {
  let component: HostGroupSummaryComponent;
  let fixture: ComponentFixture<HostGroupSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostGroupSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostGroupSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
