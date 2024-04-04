import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartadminComponent } from './smartadmin.component';

describe('SmartadminComponent', () => {
  let component: SmartadminComponent;
  let fixture: ComponentFixture<SmartadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartadminComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SmartadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
