import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsarFlowHostsIndexComponent } from './isar-flow-hosts-index.component';

describe('IsarFlowHostsIndexComponent', () => {
  let component: IsarFlowHostsIndexComponent;
  let fixture: ComponentFixture<IsarFlowHostsIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsarFlowHostsIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IsarFlowHostsIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
