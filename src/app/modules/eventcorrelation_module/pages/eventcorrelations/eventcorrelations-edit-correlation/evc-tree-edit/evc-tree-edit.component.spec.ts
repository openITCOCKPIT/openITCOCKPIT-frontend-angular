import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvcTreeEditComponent } from './evc-tree-edit.component';

describe('EvcTreeEditComponent', () => {
  let component: EvcTreeEditComponent;
  let fixture: ComponentFixture<EvcTreeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvcTreeEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvcTreeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
