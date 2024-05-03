import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesIndexFilterComponent } from './services-index-filter.component';

describe('ServicesIndexFilterComponent', () => {
  let component: ServicesIndexFilterComponent;
  let fixture: ComponentFixture<ServicesIndexFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesIndexFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicesIndexFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
