import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationitemsExportComponent } from './configurationitems-export.component';

describe('ConfigurationitemsExportComponent', () => {
  let component: ConfigurationitemsExportComponent;
  let fixture: ComponentFixture<ConfigurationitemsExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigurationitemsExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigurationitemsExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
