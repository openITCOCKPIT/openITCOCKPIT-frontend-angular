import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionCheckComponent } from './version-check.component';

describe('VersionCheckComponent', () => {
  let component: VersionCheckComponent;
  let fixture: ComponentFixture<VersionCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionCheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VersionCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
