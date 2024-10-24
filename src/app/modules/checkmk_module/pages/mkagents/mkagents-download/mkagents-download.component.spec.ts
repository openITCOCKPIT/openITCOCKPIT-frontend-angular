import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MkagentsDownloadComponent } from './mkagents-download.component';

describe('MkagentsDownloadComponent', () => {
  let component: MkagentsDownloadComponent;
  let fixture: ComponentFixture<MkagentsDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MkagentsDownloadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MkagentsDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
