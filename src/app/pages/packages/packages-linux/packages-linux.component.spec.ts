import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesLinuxComponent } from './packages-linux.component';

describe('PackagesIndexComponent', () => {
  let component: PackagesLinuxComponent;
  let fixture: ComponentFixture<PackagesLinuxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagesLinuxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesLinuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
