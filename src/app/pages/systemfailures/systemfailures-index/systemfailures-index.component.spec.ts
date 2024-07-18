import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemfailuresIndexComponent } from './systemfailures-index.component';

describe('SystemfailuresIndexComponent', () => {
  let component: SystemfailuresIndexComponent;
  let fixture: ComponentFixture<SystemfailuresIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemfailuresIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SystemfailuresIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
