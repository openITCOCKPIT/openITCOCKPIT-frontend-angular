import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceescalationsEditComponent } from './serviceescalations-edit.component';

describe('ServiceescalationsAddComponent', () => {
  let component: ServiceescalationsEditComponent;
  let fixture: ComponentFixture<ServiceescalationsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceescalationsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceescalationsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
