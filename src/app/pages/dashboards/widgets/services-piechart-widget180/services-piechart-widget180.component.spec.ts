import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesPiechartWidget180Component } from './services-piechart-widget180.component';

describe('ServicesPiechartWidget180Component', () => {
  let component: ServicesPiechartWidget180Component;
  let fixture: ComponentFixture<ServicesPiechartWidget180Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesPiechartWidget180Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesPiechartWidget180Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
