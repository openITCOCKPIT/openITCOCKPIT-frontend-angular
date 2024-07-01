import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DowntimesHostComponent } from './downtimes-host.component';

describe('DowntimesHostComponent', () => {
  let component: DowntimesHostComponent;
  let fixture: ComponentFixture<DowntimesHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DowntimesHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DowntimesHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
