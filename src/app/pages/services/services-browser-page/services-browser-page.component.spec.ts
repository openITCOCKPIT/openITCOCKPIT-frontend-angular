import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesBrowserPageComponent } from './services-browser-page.component';

describe('ServicesBrowserPageComponent', () => {
  let component: ServicesBrowserPageComponent;
  let fixture: ComponentFixture<ServicesBrowserPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesBrowserPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicesBrowserPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
