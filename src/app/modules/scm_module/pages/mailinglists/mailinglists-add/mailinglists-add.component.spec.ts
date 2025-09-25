import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailinglistsAddComponent } from './mailinglists-add.component';

describe('MailinglistsAddComponent', () => {
  let component: MailinglistsAddComponent;
  let fixture: ComponentFixture<MailinglistsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MailinglistsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MailinglistsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
