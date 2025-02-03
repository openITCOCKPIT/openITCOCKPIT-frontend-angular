import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoreportSettingsIndexComponent } from './autoreport-settings-index.component';

describe('AutoreportSettingsIndexComponent', () => {
  let component: AutoreportSettingsIndexComponent;
  let fixture: ComponentFixture<AutoreportSettingsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoreportSettingsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoreportSettingsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
