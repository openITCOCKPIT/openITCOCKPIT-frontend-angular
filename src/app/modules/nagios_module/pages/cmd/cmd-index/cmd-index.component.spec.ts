import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmdIndexComponent } from './cmd-index.component';

describe('CmdIndexComponent', () => {
  let component: CmdIndexComponent;
  let fixture: ComponentFixture<CmdIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmdIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmdIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
