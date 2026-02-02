import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesViewMacosAppComponent } from './packages-view-macos-app.component';

describe('PackagesViewMacosAppComponent', () => {
  let component: PackagesViewMacosAppComponent;
  let fixture: ComponentFixture<PackagesViewMacosAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagesViewMacosAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesViewMacosAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
