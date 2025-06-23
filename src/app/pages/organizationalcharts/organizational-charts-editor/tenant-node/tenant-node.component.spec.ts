import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantNodeComponent } from './tenant-node.component';

describe('TenantNodeComponent', () => {
  let component: TenantNodeComponent;
  let fixture: ComponentFixture<TenantNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantNodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
