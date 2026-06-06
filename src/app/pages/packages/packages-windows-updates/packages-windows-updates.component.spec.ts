import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesWindowsUpdatesComponent } from './packages-windows-updates.component';

describe('PackagesWindowsUpdatesComponent', () => {
  let component: PackagesWindowsUpdatesComponent;
  let fixture: ComponentFixture<PackagesWindowsUpdatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagesWindowsUpdatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesWindowsUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
