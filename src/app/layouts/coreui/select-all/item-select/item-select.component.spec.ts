import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSelectComponent } from './item-select.component';

describe('ItemSelectComponent', () => {
  let component: ItemSelectComponent;
  let fixture: ComponentFixture<ItemSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ItemSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
