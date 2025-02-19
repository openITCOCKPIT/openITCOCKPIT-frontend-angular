import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapeditorsViewComponent } from './mapeditors-view.component';

describe('MapeditorsViewComponent', () => {
  let component: MapeditorsViewComponent;
  let fixture: ComponentFixture<MapeditorsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapeditorsViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapeditorsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
