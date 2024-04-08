import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeLanguageComponent } from './change-language.component';

describe('ChangeLanguageComponent', () => {
  let component: ChangeLanguageComponent;
  let fixture: ComponentFixture<ChangeLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeLanguageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChangeLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
