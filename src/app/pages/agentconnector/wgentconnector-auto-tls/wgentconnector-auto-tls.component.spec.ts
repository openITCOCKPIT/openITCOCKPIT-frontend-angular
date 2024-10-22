import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WgentconnectorAutoTlsComponent } from './wgentconnector-auto-tls.component';

describe('WgentconnectorAutoTlsComponent', () => {
  let component: WgentconnectorAutoTlsComponent;
  let fixture: ComponentFixture<WgentconnectorAutoTlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WgentconnectorAutoTlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WgentconnectorAutoTlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
