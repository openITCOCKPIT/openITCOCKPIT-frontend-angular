import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostdefaultsEditComponent } from './hostdefaults-edit.component';

describe('HostdefaultsEditComponent', () => {
  let component: HostdefaultsEditComponent;
  let fixture: ComponentFixture<HostdefaultsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostdefaultsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HostdefaultsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
