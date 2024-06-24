import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesAddComponent } from './services-add.component';

describe('ServicesAddComponent', () => {
  let component: ServicesAddComponent;
  let fixture: ComponentFixture<ServicesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
