import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvcOperatorComponent } from './evc-operator.component';

describe('EvcOperatorComponent', () => {
  let component: EvcOperatorComponent;
  let fixture: ComponentFixture<EvcOperatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvcOperatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvcOperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
