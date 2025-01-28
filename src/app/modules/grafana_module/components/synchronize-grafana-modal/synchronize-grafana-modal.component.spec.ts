import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynchronizeGrafanaModalComponent } from './synchronize-grafana-modal.component';

describe('SynchronizeGrafanaModalComponent', () => {
  let component: SynchronizeGrafanaModalComponent;
  let fixture: ComponentFixture<SynchronizeGrafanaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SynchronizeGrafanaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SynchronizeGrafanaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
