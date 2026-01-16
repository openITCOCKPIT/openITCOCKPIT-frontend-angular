import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagesIndexComponent } from './packages-index.component';

describe('PackagesIndexComponent', () => {
  let component: PackagesIndexComponent;
  let fixture: ComponentFixture<PackagesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagesIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
