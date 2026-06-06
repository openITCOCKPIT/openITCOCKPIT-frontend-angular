import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesOsTabsComponent } from './packages-os-tabs.component';

describe('PackagesOsTabsComponent', () => {
  let component: PackagesOsTabsComponent;
  let fixture: ComponentFixture<PackagesOsTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagesOsTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesOsTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
