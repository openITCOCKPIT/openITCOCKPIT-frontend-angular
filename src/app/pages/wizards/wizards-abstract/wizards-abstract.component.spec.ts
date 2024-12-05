import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardsAbstractComponent } from './wizards-abstract.component';

describe('WizardsAbstractComponent', () => {
  let component: WizardsAbstractComponent;
  let fixture: ComponentFixture<WizardsAbstractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardsAbstractComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WizardsAbstractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
