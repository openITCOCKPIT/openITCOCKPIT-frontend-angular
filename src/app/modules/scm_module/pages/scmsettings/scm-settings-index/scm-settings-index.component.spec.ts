import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScmSettingsIndexComponent } from './scm-settings-index.component';

describe('ScmSettingsIndexComponent', () => {
  let component: ScmSettingsIndexComponent;
  let fixture: ComponentFixture<ScmSettingsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScmSettingsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScmSettingsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
