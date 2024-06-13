import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeSelectComponent } from './fake-select.component';

describe('FakeSelectComponent', () => {
  let component: FakeSelectComponent;
  let fixture: ComponentFixture<FakeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FakeSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FakeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
