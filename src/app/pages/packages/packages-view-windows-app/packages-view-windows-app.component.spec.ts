import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesViewWindowsAppComponent } from './packages-view-windows-app.component';

describe('PackagesViewWindowsAppComponent', () => {
  let component: PackagesViewWindowsAppComponent;
  let fixture: ComponentFixture<PackagesViewWindowsAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagesViewWindowsAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesViewWindowsAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
