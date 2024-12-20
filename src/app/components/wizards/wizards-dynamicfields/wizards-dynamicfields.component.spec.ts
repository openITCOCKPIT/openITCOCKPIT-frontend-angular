import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardsDynamicfieldsComponent } from './wizards-dynamicfields.component';

describe('WizardsDynamicfieldsComponent', () => {
  let component: WizardsDynamicfieldsComponent;
  let fixture: ComponentFixture<WizardsDynamicfieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardsDynamicfieldsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WizardsDynamicfieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
