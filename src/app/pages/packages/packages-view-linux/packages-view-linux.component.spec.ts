import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesViewLinuxComponent } from './packages-view-linux.component';

describe('PackagesViewLinuxComponent', () => {
  let component: PackagesViewLinuxComponent;
  let fixture: ComponentFixture<PackagesViewLinuxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagesViewLinuxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesViewLinuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
