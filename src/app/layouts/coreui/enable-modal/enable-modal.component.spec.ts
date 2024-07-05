import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableModalComponent } from './enable-modal.component';

describe('EnableModalComponent', () => {
  let component: EnableModalComponent;
  let fixture: ComponentFixture<EnableModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnableModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnableModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
