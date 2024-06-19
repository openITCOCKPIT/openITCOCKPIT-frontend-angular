import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicedependenciesAddComponent } from './servicedependencies-add.component';

describe('ServicedependenciesAddComponent', () => {
  let component: ServicedependenciesAddComponent;
  let fixture: ComponentFixture<ServicedependenciesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicedependenciesAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicedependenciesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
