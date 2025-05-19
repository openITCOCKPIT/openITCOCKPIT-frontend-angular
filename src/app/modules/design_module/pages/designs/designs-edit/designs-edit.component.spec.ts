import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignsEditComponent } from './designs-edit.component';

describe('DesignsEditComponent', () => {
  let component: DesignsEditComponent;
  let fixture: ComponentFixture<DesignsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
