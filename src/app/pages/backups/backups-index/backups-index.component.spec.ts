import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackupsIndexComponent } from './backups-index.component';

describe('BackupsIndexComponent', () => {
  let component: BackupsIndexComponent;
  let fixture: ComponentFixture<BackupsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackupsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackupsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
