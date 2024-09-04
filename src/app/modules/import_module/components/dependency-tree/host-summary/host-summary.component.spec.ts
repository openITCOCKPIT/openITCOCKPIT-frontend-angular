import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostSummaryComponent } from './host-summary.component';

describe('HostSummaryComponent', () => {
  let component: HostSummaryComponent;
  let fixture: ComponentFixture<HostSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
