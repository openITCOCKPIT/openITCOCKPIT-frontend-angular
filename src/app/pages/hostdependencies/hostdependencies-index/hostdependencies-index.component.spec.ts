import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostdependenciesIndexComponent } from './hostdependencies-index.component';

describe('HostdependenciesIndexComponent', () => {
  let component: HostdependenciesIndexComponent;
  let fixture: ComponentFixture<HostdependenciesIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostdependenciesIndexComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HostdependenciesIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
