import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesStatusListExtendedWidgetComponent } from './services-status-list-extended-widget.component';

describe('ServicesStatusListExtendedWidgetComponent', () => {
  let component: ServicesStatusListExtendedWidgetComponent;
  let fixture: ComponentFixture<ServicesStatusListExtendedWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesStatusListExtendedWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesStatusListExtendedWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
