import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesViewMacosUpdateComponent } from './packages-view-macos-update.component';

describe('PackagesViewMacosUpdateComponent', () => {
  let component: PackagesViewMacosUpdateComponent;
  let fixture: ComponentFixture<PackagesViewMacosUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagesViewMacosUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesViewMacosUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
