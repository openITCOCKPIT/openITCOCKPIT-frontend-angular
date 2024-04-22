import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectUuidComponent } from './object-uuid.component';

describe('ObjectUuidComponent', () => {
  let component: ObjectUuidComponent;
  let fixture: ComponentFixture<ObjectUuidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectUuidComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ObjectUuidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
