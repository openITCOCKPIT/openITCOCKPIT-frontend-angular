import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WgentconnectorInstallComponent } from './wgentconnector-install.component';

describe('WgentconnectorInstallComponent', () => {
  let component: WgentconnectorInstallComponent;
  let fixture: ComponentFixture<WgentconnectorInstallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WgentconnectorInstallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WgentconnectorInstallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
