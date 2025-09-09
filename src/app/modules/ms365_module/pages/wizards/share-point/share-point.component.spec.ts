import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharePointComponent } from './share-point.component';

describe('SharePointComponent', () => {
  let component: SharePointComponent;
  let fixture: ComponentFixture<SharePointComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharePointComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
