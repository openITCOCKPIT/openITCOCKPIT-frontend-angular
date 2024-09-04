import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Error403Component } from './error403.component';

describe('Error403Component', () => {
  let component: Error403Component;
  let fixture: ComponentFixture<Error403Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Error403Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Error403Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
