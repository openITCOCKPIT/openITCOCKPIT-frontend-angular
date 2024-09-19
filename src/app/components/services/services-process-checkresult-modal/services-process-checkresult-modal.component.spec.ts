import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesProcessCheckresultModalComponent } from './services-process-checkresult-modal.component';

describe('ServicesProcessCheckresultModalComponent', () => {
  let component: ServicesProcessCheckresultModalComponent;
  let fixture: ComponentFixture<ServicesProcessCheckresultModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesProcessCheckresultModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesProcessCheckresultModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
