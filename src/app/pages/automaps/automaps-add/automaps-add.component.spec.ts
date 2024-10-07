import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomapsAddComponent } from './automaps-add.component';

describe('AutomapsAddComponent', () => {
  let component: AutomapsAddComponent;
  let fixture: ComponentFixture<AutomapsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutomapsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomapsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
