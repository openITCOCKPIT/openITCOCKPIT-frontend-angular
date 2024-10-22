import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WgentconnectorCreateServicesComponent } from './wgentconnector-create-services.component';

describe('WgentconnectorCreateServicesComponent', () => {
  let component: WgentconnectorCreateServicesComponent;
  let fixture: ComponentFixture<WgentconnectorCreateServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WgentconnectorCreateServicesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WgentconnectorCreateServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
