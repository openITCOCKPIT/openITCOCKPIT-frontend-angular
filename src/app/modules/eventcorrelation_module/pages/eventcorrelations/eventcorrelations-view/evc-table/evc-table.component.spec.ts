import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvcTableComponent } from './evc-table.component';

describe('EvcTableComponent', () => {
  let component: EvcTableComponent;
  let fixture: ComponentFixture<EvcTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvcTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvcTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
