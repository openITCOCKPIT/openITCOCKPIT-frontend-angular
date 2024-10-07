import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsergroupsIndexComponent } from './usergroups-index.component';

describe('UsergroupsIndexComponent', () => {
  let component: UsergroupsIndexComponent;
  let fixture: ComponentFixture<UsergroupsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsergroupsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsergroupsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
