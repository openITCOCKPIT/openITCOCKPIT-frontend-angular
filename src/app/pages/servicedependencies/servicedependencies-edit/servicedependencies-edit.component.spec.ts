import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicedependenciesEditComponent } from './servicedependencies-edit.component';

describe('ServicedependenciesEditComponent', () => {
  let component: ServicedependenciesEditComponent;
  let fixture: ComponentFixture<ServicedependenciesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicedependenciesEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicedependenciesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
