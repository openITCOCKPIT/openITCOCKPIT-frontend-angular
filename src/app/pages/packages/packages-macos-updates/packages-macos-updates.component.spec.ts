import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesMacosUpdatesComponent } from './packages-macos-updates.component';

describe('PackagesMacosUpdatesComponent', () => {
  let component: PackagesMacosUpdatesComponent;
  let fixture: ComponentFixture<PackagesMacosUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagesMacosUpdatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesMacosUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
