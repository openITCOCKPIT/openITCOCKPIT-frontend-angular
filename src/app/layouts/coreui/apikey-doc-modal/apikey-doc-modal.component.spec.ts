import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApikeyDocModalComponent } from './apikey-doc-modal.component';

describe('ApikeyDocModalComponent', () => {
  let component: ApikeyDocModalComponent;
  let fixture: ComponentFixture<ApikeyDocModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApikeyDocModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApikeyDocModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
