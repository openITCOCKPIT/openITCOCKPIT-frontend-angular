import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProxyIndexComponent } from './proxy-index.component';

describe('ProxyIndexComponent', () => {
  let component: ProxyIndexComponent;
  let fixture: ComponentFixture<ProxyIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProxyIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProxyIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
