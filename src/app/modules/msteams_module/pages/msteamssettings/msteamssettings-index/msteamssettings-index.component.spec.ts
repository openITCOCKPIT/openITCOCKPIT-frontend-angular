import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsteamssettingsIndexComponent } from './msteamssettings-index.component';

describe('MsteamssettingsIndexComponent', () => {
  let component: MsteamssettingsIndexComponent;
  let fixture: ComponentFixture<MsteamssettingsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MsteamssettingsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsteamssettingsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
