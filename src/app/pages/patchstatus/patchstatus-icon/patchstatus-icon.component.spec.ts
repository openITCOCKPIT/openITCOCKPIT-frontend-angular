import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatchstatusIconComponent } from './patchstatus-icon.component';

describe('PatchstatusIconComponent', () => {
  let component: PatchstatusIconComponent;
  let fixture: ComponentFixture<PatchstatusIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatchstatusIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatchstatusIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
