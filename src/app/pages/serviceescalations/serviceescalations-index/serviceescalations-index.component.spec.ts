import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceescalationsIndexComponent } from './serviceescalations-index.component';

describe('ServiceescalationsIndexComponent', () => {
  let component: ServiceescalationsIndexComponent;
  let fixture: ComponentFixture<ServiceescalationsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceescalationsIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceescalationsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
