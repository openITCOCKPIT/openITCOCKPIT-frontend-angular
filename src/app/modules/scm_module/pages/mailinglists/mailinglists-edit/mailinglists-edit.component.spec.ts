import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailinglistsEditComponent } from './mailinglists-edit.component';

describe('MailinglistsEditComponent', () => {
  let component: MailinglistsEditComponent;
  let fixture: ComponentFixture<MailinglistsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailinglistsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailinglistsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
