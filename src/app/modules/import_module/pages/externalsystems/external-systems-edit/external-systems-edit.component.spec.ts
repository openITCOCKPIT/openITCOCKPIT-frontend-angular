import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalSystemsEditComponent } from './external-systems-edit.component';

describe('ExternalSystemsEditComponent', () => {
  let component: ExternalSystemsEditComponent;
  let fixture: ComponentFixture<ExternalSystemsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalSystemsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalSystemsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
