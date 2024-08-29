import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicenowHostBrowserTabComponent } from './servicenow-host-browser-tab.component';

describe('ServicenowHostBrowserTabComponent', () => {
  let component: ServicenowHostBrowserTabComponent;
  let fixture: ComponentFixture<ServicenowHostBrowserTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicenowHostBrowserTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicenowHostBrowserTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
