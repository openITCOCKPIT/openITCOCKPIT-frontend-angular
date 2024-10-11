import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsergroupsAddComponent } from './usergroups-add.component';

describe('UsergroupsAddComponent', () => {
  let component: UsergroupsAddComponent;
  let fixture: ComponentFixture<UsergroupsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsergroupsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsergroupsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
