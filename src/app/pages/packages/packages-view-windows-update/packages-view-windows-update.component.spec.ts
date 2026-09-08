import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesViewWindowsUpdateComponent } from './packages-view-windows-update.component';

describe('PackagesViewWindowsUpdateComponent', () => {
  let component: PackagesViewWindowsUpdateComponent;
  let fixture: ComponentFixture<PackagesViewWindowsUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagesViewWindowsUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesViewWindowsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
