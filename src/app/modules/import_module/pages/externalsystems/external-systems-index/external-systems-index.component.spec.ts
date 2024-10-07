import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalSystemsIndexComponent } from './external-systems-index.component';

describe('ExternalSystemsIndexComponent', () => {
  let component: ExternalSystemsIndexComponent;
  let fixture: ComponentFixture<ExternalSystemsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalSystemsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalSystemsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
