import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatchstatusIndexComponent } from './patchstatus-index.component';

describe('PatchstatusIndexComponent', () => {
  let component: PatchstatusIndexComponent;
  let fixture: ComponentFixture<PatchstatusIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatchstatusIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatchstatusIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
