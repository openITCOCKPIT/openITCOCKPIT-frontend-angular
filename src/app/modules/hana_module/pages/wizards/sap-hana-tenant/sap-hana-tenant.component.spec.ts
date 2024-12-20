import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SapHanaTenantComponent } from './sap-hana-tenant.component';

describe('SapHanaTenantComponent', () => {
  let component: SapHanaTenantComponent;
  let fixture: ComponentFixture<SapHanaTenantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SapHanaTenantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SapHanaTenantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
