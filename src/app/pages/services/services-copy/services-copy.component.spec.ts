import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesCopyComponent } from './services-copy.component';

describe('ServicesCopyComponent', () => {
  let component: ServicesCopyComponent;
  let fixture: ComponentFixture<ServicesCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesCopyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
