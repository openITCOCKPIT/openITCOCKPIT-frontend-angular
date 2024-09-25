import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantsIndexComponent } from './tenants-index.component';

describe('TenantsIndexComponent', () => {
  let component: TenantsIndexComponent;
  let fixture: ComponentFixture<TenantsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
