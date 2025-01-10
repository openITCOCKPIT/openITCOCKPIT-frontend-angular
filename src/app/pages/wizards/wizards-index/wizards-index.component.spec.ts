import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardsIndexComponent } from './wizards-index.component';

describe('WizardsIndexComponent', () => {
  let component: WizardsIndexComponent;
  let fixture: ComponentFixture<WizardsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WizardsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
