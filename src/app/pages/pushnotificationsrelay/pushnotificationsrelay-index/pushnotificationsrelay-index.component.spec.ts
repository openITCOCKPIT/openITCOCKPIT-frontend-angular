import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PushnotificationsrelayIndexComponent } from './pushnotificationsrelay-index.component';

describe('PushnotificationsrelayIndexComponent', () => {
  let component: PushnotificationsrelayIndexComponent;
  let fixture: ComponentFixture<PushnotificationsrelayIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PushnotificationsrelayIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PushnotificationsrelayIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
