import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalMonitoringsAddComponent } from './external-monitorings-add.component';

describe('ExternalMonitoringsAddComponent', () => {
  let component: ExternalMonitoringsAddComponent;
  let fixture: ComponentFixture<ExternalMonitoringsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalMonitoringsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalMonitoringsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
