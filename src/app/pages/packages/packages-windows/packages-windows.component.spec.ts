import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesWindowsComponent } from './packages-windows.component';

describe('PackagesWindowsComponent', () => {
  let component: PackagesWindowsComponent;
  let fixture: ComponentFixture<PackagesWindowsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagesWindowsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesWindowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
