import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBrowserModalComponent } from './service-browser-modal.component';

describe('ServiceBrowserModalComponent', () => {
  let component: ServiceBrowserModalComponent;
  let fixture: ComponentFixture<ServiceBrowserModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceBrowserModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceBrowserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
