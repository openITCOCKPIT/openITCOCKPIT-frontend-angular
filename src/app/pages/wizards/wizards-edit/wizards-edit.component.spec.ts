import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardsEditComponent } from './wizards-edit.component';

describe('WizardsEditComponent', () => {
  let component: WizardsEditComponent;
  let fixture: ComponentFixture<WizardsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WizardsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
