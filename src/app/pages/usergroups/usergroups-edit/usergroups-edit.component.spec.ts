import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsergroupsEditComponent } from './usergroups-edit.component';

describe('UsergroupsEditComponent', () => {
  let component: UsergroupsEditComponent;
  let fixture: ComponentFixture<UsergroupsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsergroupsEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsergroupsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
