import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesSummaryComponent } from './packages-summary.component';

describe('PackagesSummaryComponent', () => {
  let component: PackagesSummaryComponent;
  let fixture: ComponentFixture<PackagesSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagesSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
