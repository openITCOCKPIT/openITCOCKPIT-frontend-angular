import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WgentconnectorWizardComponent } from './wgentconnector-wizard.component';

describe('WgentconnectorWizardComponent', () => {
  let component: WgentconnectorWizardComponent;
  let fixture: ComponentFixture<WgentconnectorWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WgentconnectorWizardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WgentconnectorWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
