import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesServiceListComponent } from './services-service-list.component';

describe('ServicesServiceListComponent', () => {
  let component: ServicesServiceListComponent;
  let fixture: ComponentFixture<ServicesServiceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesServiceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
