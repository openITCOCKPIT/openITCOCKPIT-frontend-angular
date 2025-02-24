import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesStatusListWidgetComponent } from './services-status-list-widget.component';

describe('ServicesStatusListWidgetComponent', () => {
  let component: ServicesStatusListWidgetComponent;
  let fixture: ComponentFixture<ServicesStatusListWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesStatusListWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesStatusListWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
