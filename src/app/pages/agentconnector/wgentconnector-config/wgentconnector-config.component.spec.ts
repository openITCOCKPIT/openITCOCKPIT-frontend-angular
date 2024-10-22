import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WgentconnectorConfigComponent } from './wgentconnector-config.component';

describe('WgentconnectorConfigComponent', () => {
  let component: WgentconnectorConfigComponent;
  let fixture: ComponentFixture<WgentconnectorConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WgentconnectorConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WgentconnectorConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
