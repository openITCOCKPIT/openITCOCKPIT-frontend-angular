import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesMacosComponent } from './packages-macos.component';

describe('PackagesMacosComponent', () => {
  let component: PackagesMacosComponent;
  let fixture: ComponentFixture<PackagesMacosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagesMacosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesMacosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
