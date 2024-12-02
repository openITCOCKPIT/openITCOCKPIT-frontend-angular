import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostdefaultsIndexComponent } from './hostdefaults-index.component';

describe('HostdefaultsIndexComponent', () => {
  let component: HostdefaultsIndexComponent;
  let fixture: ComponentFixture<HostdefaultsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostdefaultsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostdefaultsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
