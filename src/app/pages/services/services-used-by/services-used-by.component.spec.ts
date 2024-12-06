import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesUsedByComponent } from './services-used-by.component';

describe('ServicesUsedByComponent', () => {
  let component: ServicesUsedByComponent;
  let fixture: ComponentFixture<ServicesUsedByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesUsedByComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesUsedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
