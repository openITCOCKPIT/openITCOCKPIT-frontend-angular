import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeWidgetComponent } from './notice-widget.component';

describe('NoticeWidgetComponent', () => {
  let component: NoticeWidgetComponent;
  let fixture: ComponentFixture<NoticeWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticeWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticeWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
